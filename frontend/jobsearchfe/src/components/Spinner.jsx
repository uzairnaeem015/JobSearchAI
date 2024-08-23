import ClipLoader from 'react-spinners/ClipLoader';

const override = {
  display: 'block',
  position: 'fixed',
  top: '50%',
  left: '46%',
  transform: 'translate(-50%, -50%)',
  zIndex: 9999, // Ensure it's on top of other elements
};

const Spinner = ({ loading }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: add a semi-transparent background
        zIndex: 9998, // Ensure it's behind the loader but still on top
      }}
    >
      <ClipLoader
        color='#4338ca'
        loading={loading}
        cssOverride={override}
        size={150}
      />
    </div>
  );
};

export default Spinner;
