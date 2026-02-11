<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    /**
     * Get all conversations for the authenticated user
     */
    public function getConversations()
    {
        try {
            $user = auth('api')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            // Use correct property name with fallback
            $customerId = $user->customer_id ?? $user->id;
            
            if (!$customerId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer ID not found'
                ], 400);
            }

            // Get conversations for the user
            $conversations = DB::table('conversations')
                ->where('customer_id', $customerId)
                ->orWhere('other_customer_id', $customerId)
                ->orderBy('updated_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $conversations
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving conversations: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get unread messages count for the authenticated user
     */
    public function getUnreadCount()
    {
        try {
            $user = auth('api')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            // Use correct property name with fallback
            $customerId = $user->customer_id ?? $user->id;
            
            if (!$customerId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer ID not found'
                ], 400);
            }

            // Count unread messages
            $unreadCount = DB::table('messages')
                ->join('conversations', 'messages.conversation_id', '=', 'conversations.id')
                ->where(function($query) use ($customerId) {
                    $query->where('conversations.customer_id', $customerId)
                          ->orWhere('conversations.other_customer_id', $customerId);
                })
                ->where('messages.sender_id', '!=', $customerId)
                ->where('messages.is_read', 0)
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'unread_count' => $unreadCount
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving unread count: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Start a new conversation
     */
    public function startConversation(Request $request)
    {
        try {
            $user = auth('api')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            $customerId = $user->customer_id ?? $user->id;
            
            if (!$customerId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer ID not found'
                ], 400);
            }

            $validated = $request->validate([
                'other_customer_id' => 'required|integer',
                'initial_message' => 'required|string|max:1000'
            ]);

            // Check if conversation already exists
            $existingConversation = DB::table('conversations')
                ->where(function($query) use ($customerId, $validated) {
                    $query->where('customer_id', $customerId)
                          ->where('other_customer_id', $validated['other_customer_id']);
                })
                ->orWhere(function($query) use ($customerId, $validated) {
                    $query->where('customer_id', $validated['other_customer_id'])
                          ->where('other_customer_id', $customerId);
                })
                ->first();

            if ($existingConversation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Conversation already exists'
                ], 400);
            }

            // Create new conversation
            $conversationId = DB::table('conversations')->insertGetId([
                'customer_id' => $customerId,
                'other_customer_id' => $validated['other_customer_id'],
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // Add initial message
            DB::table('messages')->insert([
                'conversation_id' => $conversationId,
                'sender_id' => $customerId,
                'message' => $validated['initial_message'],
                'is_read' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'conversation_id' => $conversationId
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error starting conversation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get messages for a specific conversation
     */
    public function getMessages($conversationId, Request $request)
    {
        try {
            $user = auth('api')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            $customerId = $user->customer_id ?? $user->id;
            
            if (!$customerId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer ID not found'
                ], 400);
            }

            // Check if user is part of this conversation
            $conversation = DB::table('conversations')
                ->where('id', $conversationId)
                ->where(function($query) use ($customerId) {
                    $query->where('customer_id', $customerId)
                          ->orWhere('other_customer_id', $customerId);
                })
                ->first();

            if (!$conversation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Conversation not found or access denied'
                ], 404);
            }

            $page = $request->get('page', 1);
            $perPage = $request->get('per_page', 50);
            $offset = ($page - 1) * $perPage;

            // Get messages
            $messages = DB::table('messages')
                ->where('conversation_id', $conversationId)
                ->orderBy('created_at', 'desc')
                ->offset($offset)
                ->limit($perPage)
                ->get();

            // Mark messages as read if they're not from the current user
            DB::table('messages')
                ->where('conversation_id', $conversationId)
                ->where('sender_id', '!=', $customerId)
                ->where('is_read', 0)
                ->update(['is_read' => 1]);

            return response()->json([
                'success' => true,
                'data' => $messages
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving messages: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send a message
     */
    public function sendMessage($conversationId, Request $request)
    {
        try {
            $user = auth('api')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            $customerId = $user->customer_id ?? $user->id;
            
            if (!$customerId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer ID not found'
                ], 400);
            }

            $validated = $request->validate([
                'message' => 'required|string|max:1000'
            ]);

            // Check if user is part of this conversation
            $conversation = DB::table('conversations')
                ->where('id', $conversationId)
                ->where(function($query) use ($customerId) {
                    $query->where('customer_id', $customerId)
                          ->orWhere('other_customer_id', $customerId);
                })
                ->first();

            if (!$conversation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Conversation not found or access denied'
                ], 404);
            }

            // Insert message
            $messageId = DB::table('messages')->insertGetId([
                'conversation_id' => $conversationId,
                'sender_id' => $customerId,
                'message' => $validated['message'],
                'is_read' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // Update conversation timestamp
            DB::table('conversations')
                ->where('id', $conversationId)
                ->update(['updated_at' => now()]);

            return response()->json([
                'success' => true,
                'data' => [
                    'message_id' => $messageId
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending message: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Close a conversation
     */
    public function closeConversation($conversationId)
    {
        try {
            $user = auth('api')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            $customerId = $user->customer_id ?? $user->id;
            
            if (!$customerId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer ID not found'
                ], 400);
            }

            // Check if user is part of this conversation
            $conversation = DB::table('conversations')
                ->where('id', $conversationId)
                ->where(function($query) use ($customerId) {
                    $query->where('customer_id', $customerId)
                          ->orWhere('other_customer_id', $customerId);
                })
                ->first();

            if (!$conversation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Conversation not found or access denied'
                ], 404);
            }

            // Close conversation
            DB::table('conversations')
                ->where('id', $conversationId)
                ->update(['status' => 'closed']);

            return response()->json([
                'success' => true,
                'message' => 'Conversation closed successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error closing conversation: ' . $e->getMessage()
            ], 500);
        }
    }
}
