import { useAppSelector } from "@/redux/hook";
import { useMemo, useCallback } from "react";

/**
 * Custom hook to check user permissions
 * Usage: 
 * const { hasPermission, isAdmin } = usePermissions();
 * if (hasPermission("Ürün Görüntüle")) { ... }
 */
export const usePermissions = () => {
    const { user, loading: reduxLoading } = useAppSelector((state) => state.user);

    // If user object is empty, we are still loading the profile
    const isLoading = useMemo(() => {
        return reduxLoading || !user || Object.keys(user).length === 0;
    }, [reduxLoading, user]);

    // Staff type admin, role admin, or provider type bypasses all checks
    const isAdmin = useMemo(() => {
        if (isLoading) return false;

        const role = user?.role || "";
        const staffType = user?.staffType || "";
        const userType = user?.userType || "";

        return role === "admin" || staffType === "admin" || userType === "provider";
    }, [isLoading, user]);

    const isProvider = useMemo(() => {
        return user?.userType === "provider";
    }, [user]);

    const isCustomer = useMemo(() => {
        return user?.userType === "customer";
    }, [user]);

    const userPermissions = useMemo(() => {
        return user?.department?.permissions || [];
    }, [user]);

    const isApprover = useMemo(() => {
        return user?.department?.isApprover || false;
    }, [user]);

    const hasPermission = useCallback((permission: string) => {
        if (isAdmin || isProvider) return true;
        return userPermissions.includes(permission);
    }, [isAdmin, isProvider, userPermissions]);

    const hasAnyPermission = useCallback((permissions: string[]) => {
        if (isAdmin || isProvider) return true;
        return permissions.some(p => userPermissions.includes(p));
    }, [isAdmin, isProvider, userPermissions]);

    return {
        hasPermission,
        hasAnyPermission,
        isAdmin,
        isProvider,
        isCustomer,
        isApprover,
        isLoading,
        userPermissions,
        user
    };
};
