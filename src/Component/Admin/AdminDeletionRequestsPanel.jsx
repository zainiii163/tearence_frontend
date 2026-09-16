import React, { useCallback, useEffect, useState } from "react";
import { FaTrashAlt, FaCheck, FaTimes, FaSyncAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import userService from "../../services/UserServices";

/**
 * Admin review queue for account-deletion requests.
 *
 * Users can only *request* deletion (POST /customer/{id}/request-deletion),
 * which sets `deletion_requested_at`. This panel lists those pending accounts
 * and lets an admin Approve (DELETE /customer/{id} — soft-deletes, so the user
 * can no longer sign in) or Reject (POST /customer/{id}/reject-deletion — the
 * account stays active). Self-contained on userService, matching the other
 * admin panels.
 */
const AdminDeletionRequestsPanel = ({ onCountChange }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState(null);

  // Keep the tab badge in sync with the live list (load, approve, reject).
  useEffect(() => {
    if (typeof onCountChange === "function") onCountChange(requests.length);
  }, [requests, onCountChange]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getDeletionRequests();
      // Envelope: { status, message, data: [...] } or { data: [...] }
      const data = res?.data?.data ?? res?.data ?? [];
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Could not load deletion requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (customerId) => {
    if (
      !window.confirm(
        "Approve deletion? The account will be deleted and the user will no longer be able to sign in."
      )
    ) {
      return;
    }
    try {
      setActingId(customerId);
      await userService.deleteUser(customerId);
      toast.success("Account deletion approved.");
      setRequests((prev) => prev.filter((r) => r.customer_id !== customerId));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Could not approve."
      );
    } finally {
      setActingId(null);
    }
  };

  const reject = async (customerId) => {
    try {
      setActingId(customerId);
      await userService.rejectDeletion(customerId);
      toast.success("Deletion request rejected.");
      setRequests((prev) => prev.filter((r) => r.customer_id !== customerId));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Could not reject."
      );
    } finally {
      setActingId(null);
    }
  };

  const fullName = (r) =>
    [r.first_name, r.last_name].filter(Boolean).join(" ").trim() || "—";

  const when = (ts) => {
    if (!ts) return "—";
    const d = new Date(ts);
    return isNaN(d.getTime()) ? String(ts) : d.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaTrashAlt className="h-5 w-5 text-destructive" />
          <h3 className="text-lg font-semibold text-foreground">
            Account Deletion Requests
          </h3>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border h-9 px-3 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-60"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading…
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No pending deletion requests.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Requested</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.customer_id} className="border-t">
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.customer_id}
                    </td>
                    <td className="px-4 py-3 text-foreground">{fullName(r)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {when(r.deletion_requested_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => approve(r.customer_id)}
                          disabled={actingId === r.customer_id}
                          className="inline-flex items-center gap-1 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 px-3 text-xs font-medium disabled:opacity-60"
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => reject(r.customer_id)}
                          disabled={actingId === r.customer_id}
                          className="inline-flex items-center gap-1 rounded-md border h-8 px-3 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-60"
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDeletionRequestsPanel;
