import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col, FormControl } from "react-bootstrap";
import Message from "../../components/Message/Message";
import Loader from "../../components/Loader/Loader";
import { register } from "../../store/slices/auth.slice";
import FormContainer from "../../components/FormContainer/FormContainer";

const Signuppage = ({ location, history }) => {
	const redirect = location?.search ? location.search.split("=")[1] : "/";
	const dispatch = useDispatch();
	const { authenticated, loading, signupError } = useSelector(
		(state) => state.authReducer
	);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState(null);

	useEffect(() => {
		authenticated && history.push(redirect);
	}, [history, redirect, authenticated]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage("Password do not match");
		} else {
			dispatch(register(name, email, password));
			setMessage(null);
		}
	};

	return (
		<FormContainer>
			<h1>Sign Up</h1>
			{loading && <Loader />}
			{signupError && <Message variant="danger">{signupError}</Message>}
			{message && <Message variant="danger">{message}</Message>}
			<>
				<Form onSubmit={handleSubmit}>
					<Form.Group controlId="name">
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter your name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</Form.Group>
					<Form.Group controlId="email">
						<Form.Label>Email Address</Form.Label>
						<FormControl
							type="email"
							placeholder="Enter email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Form.Group>
					<Form.Group controlId="password">
						<Form.Label>Password</Form.Label>
						<FormControl
							type="password"
							placeholder="Enter password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Group>
					<Form.Group controlId="confirmPassword">
						<Form.Label>Confirm password</Form.Label>
						<FormControl
							type="password"
							placeholder="Confirm password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</Form.Group>
					<Button type="submit" variant="primary">
						Register
					</Button>
				</Form>

				<Row className="py-3">
					<Col>
						Have an account?{" "}
						<Link to={redirect !== "/" ? `/login=${redirect}` : "/login"}>
							Login
						</Link>{" "}
					</Col>
				</Row>
			</>
		</FormContainer>
	);
};

export default Signuppage;
