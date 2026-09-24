import useScrollToTop from "@shared/hooks/useScrollToTop";
import SettingsView from "./SettingsView";

const Settings = () => {
  useScrollToTop();
  return (
    <>
      <h1 className="p-relative">Settings</h1>
      <SettingsView />
    </>
  );
};

export default Settings;
