export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();

    return permission === "granted";
  }

  return false;
};

export const showMedicineNotification = ({
  tabletName,
  mg,
  time,
}) => {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    console.log("Notification permission not granted");
    return;
  }

  new Notification("💊 Medicine Reminder", {
    body: `${tabletName}\nDosage: ${mg}\nTime: ${time}`,
    icon: "/medicine-icon.png",
  });
};