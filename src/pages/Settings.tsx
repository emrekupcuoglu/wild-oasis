import UpdateSettingsForm from "../features/settings/UpdateSettingsForm";
import { useSettings } from "../features/settings/useSettings";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Spinner from "../ui/Spinner";

function Settings() {
  const { isLoading, settings } = useSettings();

  if (isLoading || !settings) return <Spinner />;
  return (
    <Row>
      <Heading as="h1">Update hotel settings</Heading>
      <UpdateSettingsForm settings={settings}></UpdateSettingsForm>
    </Row>
  );
}

export default Settings;
