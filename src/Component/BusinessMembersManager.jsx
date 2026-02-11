import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  addBusinessMember,
  getBusinessMembers,
  getBusinessStore,
  removeBusinessMember,
  updateBusinessMember,
} from "../slice/StoreSlice";
import UserValidationService from "../services/UserValidationService";
import UserInvitationModal from "./UserInvitationModal";

const EMPTY_LIST = [];
const DEFAULT_ROLES = ["admin", "manager", "editor", "viewer"];

function BusinessMembersManager({
  businessId,
  fallbackMembers = EMPTY_LIST,
  fallbackRoles = DEFAULT_ROLES,
  isOwner = false,
}) {
  const dispatch = useDispatch();
  const businessMembersPayload = useSelector((state) => state.store.businessMembers?.data);

  const members = useMemo(() => {
    const list = businessMembersPayload?.members ?? fallbackMembers ?? EMPTY_LIST;
    return Array.isArray(list)
      ? list.filter((member) => member.status !== "revoked")
      : EMPTY_LIST;
  }, [businessMembersPayload?.members, fallbackMembers]);

  const availableRoles = useMemo(() => {
    const roles = businessMembersPayload?.available_roles ?? fallbackRoles ?? DEFAULT_ROLES;
    return roles.length ? roles : DEFAULT_ROLES;
  }, [businessMembersPayload?.available_roles, fallbackRoles]);

  const canManage = useMemo(() => {
    if (typeof businessMembersPayload?.can_manage === "boolean") {
      return businessMembersPayload.can_manage;
    }
    return isOwner;
  }, [businessMembersPayload?.can_manage, isOwner]);

  const currentRole = businessMembersPayload?.current_role ?? (isOwner ? "owner" : "member");

  const [email, setEmail] = useState("");
  const [role, setRole] = useState(availableRoles[0] ?? "manager");
  const [isValidating, setIsValidating] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    if (!businessId) return;
    dispatch(getBusinessMembers(businessId));
  }, [dispatch, businessId]);

  useEffect(() => {
    if (availableRoles.includes(role)) return;
    setRole(availableRoles[0] ?? "manager");
  }, [availableRoles, role]);

  const refreshBusinessDetails = () => {
    dispatch(getBusinessStore({}));
    if (businessId) {
      dispatch(getBusinessMembers(businessId));
    }
  };

  const handleAdd = async (event) => {
    event.preventDefault();

    if (!businessId) {
      toast.error("Missing business context.");
      return;
    }

    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }

    setIsValidating(true);
    
    try {
      // First check if user exists
      const userCheck = await UserValidationService.checkUserExists(email);
      
      if (!userCheck.exists) {
        // User is not registered - show invitation modal
        setPendingEmail(email);
        setShowInvitationModal(true);
        setIsValidating(false);
        return;
      }

      // User exists - proceed with adding member
      await dispatch(
        addBusinessMember({
          businessId,
          payload: { email, role },
        })
      ).unwrap();
      toast.success("Member added successfully.");
      setEmail("");
      refreshBusinessDetails();
    } catch (error) {
      toast.error(error?.message ?? "Unable to add member.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRoleUpdate = async (memberId, nextRole) => {
    try {
      await dispatch(
        updateBusinessMember({
          businessId,
          memberId,
          payload: { role: nextRole },
        })
      ).unwrap();
      toast.success("Member updated.");
      refreshBusinessDetails();
    } catch (error) {
      toast.error(error?.message ?? "Unable to update member.");
    }
  };

  const handleRemove = async (memberId) => {
    const confirmed = window.confirm("Remove this member from the business?");
    if (!confirmed) return;

    try {
      await dispatch(removeBusinessMember({ businessId, memberId })).unwrap();
      toast.success("Member removed.");
      refreshBusinessDetails();
    } catch (error) {
      toast.error(error?.message ?? "Unable to remove member.");
    }
  };

  return (
    <>
      <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Business Team</h2>
          <p className="text-sm text-muted-foreground">
            Invite colleagues to help manage this business listing.
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Your role: {currentRole}
        </span>
      </div>

      {canManage && (
        <form
          onSubmit={handleAdd}
          className="mb-6 grid gap-3 sm:grid-cols-[2fr_1fr_auto]"
        >
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="colleague@example.com"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            {availableRoles.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isValidating}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? "Checking..." : "Invite Member"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Role
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              {canManage && <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {members.length === 0 && (
              <tr>
                <td
                  colSpan={canManage ? 4 : 3}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  No team members yet.
                </td>
              </tr>
            )}
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-4 py-3 font-medium text-foreground">
                  {member.customer_name ? (
                    <span className="block">
                      {member.customer_name}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {member.email}
                      </span>
                    </span>
                  ) : (
                    member.email
                  )}
                </td>
                <td className="px-4 py-3">
                  {canManage ? (
                    <select
                      value={member.role}
                      onChange={(event) => handleRoleUpdate(member.id, event.target.value)}
                      className="rounded-md border border-border bg-background px-2 py-1 text-sm focus:border-primary focus:outline-none"
                    >
                      {availableRoles.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="capitalize text-muted-foreground">{member.role}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      member.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                {canManage && (
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemove(member.id)}
                      className="text-sm font-semibold text-red-600 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    
    <UserInvitationModal
      isOpen={showInvitationModal}
      onClose={() => {
        setShowInvitationModal(false);
        setPendingEmail("");
      }}
      email={pendingEmail}
      businessName={businessMembersPayload?.business_name}
    />
    </>
  );
}

export default BusinessMembersManager;
