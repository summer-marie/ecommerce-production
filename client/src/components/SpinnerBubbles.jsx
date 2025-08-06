import BeatLoader from "react-spinners/BeatLoader"

const Spinner = ({ loading, size = 15 }) => {
  return (
    <span
      className="inline-block align-middle"
      style={{ minWidth: "32px", minHeight: "20px", verticalAlign: "middle" }}
    >
      <BeatLoader color="teal" loading={loading} size={size} margin={2} />
    </span>
  )
}

export default Spinner