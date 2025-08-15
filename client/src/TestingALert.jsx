import AlertRed from "./components/AlertRed.jsx";
import AlertSuccess from "./components/AlertSuccess.jsx";
import AlertSuccess2 from "./components/AlertSuccess2.jsx";
import AlertBlack from "./components/AlertBlack.jsx";

const successMsg = "Pizza was created successfully!!";
const successDescription = "navigating you to the admin menu....";

const alertMsg = "Pizza creation failed!";
const alertDescription = "Please try again later.";

const TestingALert = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <AlertSuccess2
        successMsg={successMsg}
        successDescription={successDescription}
      />

      <AlertSuccess
        successMsg={successMsg}
        successDescription={successDescription}
      />

      <AlertRed alertMsg={alertMsg} alertDescription={alertDescription} />

      <AlertBlack alertMsg={alertMsg} alertDescription={alertDescription} />

    </div>
  );
};

export default TestingALert;
