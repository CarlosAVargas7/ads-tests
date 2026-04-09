import { useState } from "react";
import { UserData, UserManagement } from "../types";

export const useUserManagement = (): UserManagement => {
  const [userData, setUserData] = useState<UserData>({
    user_type: "tester",
    plan: "free",
    engagement_level: "low",
    last_activity: new Date().toISOString(),
  });

  const updateUserType = (newType: UserData["user_type"]): void => {
    const updated = {
      ...userData,
      user_type: newType,
      last_activity: new Date().toISOString(),
    };
    setUserData(updated);
    localStorage.setItem("user_data", JSON.stringify(updated));

    window.dataLayer.push({
      event: "set_user_data",
      user_properties: {
        user_type: newType,
        plan: updated.plan,
        engagement_level: updated.engagement_level,
      },
      engagement_time_msec: 100,
    });
    console.log("?? User type updated:", newType);
  };

  const updateEngagement = (level: UserData["engagement_level"]): void => {
    const updated = {
      ...userData,
      engagement_level: level,
      last_activity: new Date().toISOString(),
    };
    setUserData(updated);
    localStorage.setItem("user_data", JSON.stringify(updated));

    window.dataLayer.push({
      event: "set_user_data",
      user_properties: {
        user_type: updated.user_type,
        plan: updated.plan,
        engagement_level: level,
      },
      engagement_time_msec: 100,
    });
    console.log("?? Engagement updated:", level);
  };

  return { ...userData, updateUserType, updateEngagement };
};
