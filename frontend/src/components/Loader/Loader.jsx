import { Spinner } from "react-bootstrap";

const Loader = () => {
	return (
		<Spinner
			animation="border"
			role="status"
			style={{ width: 100, height: 100, margin: "auto", display: "block" }}
		>
			<div className="sr-only">Loading...</div>
		</Spinner>
	);
};

export default Loader;
