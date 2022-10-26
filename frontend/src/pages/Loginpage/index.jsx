import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import Message from "../../components/Message/Message";
import Loader from "../../components/Loader/Loader";
import { login } from "../../store/slices/auth.slice";
import FormContainer from "../../components/FormContainer/FormContainer";

const Loginpage = ({ location, history }) => {
	const redirect = location?.search ? location.search.split("=")[1] : "/";
	const dispatch = useDispatch();
	const { authenticated, loading, loginError } = useSelector(
		(state) => state.authReducer
	);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		authenticated && history.push(redirect);
	}, [history, redirect, authenticated]);

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(login(email, password));
	};

	return (
		<FormContainer>
			<h1>Sign in</h1>
			{loading && <Loader />}
			{loginError && <Message variant="danger">{loginError}</Message>}
			<>
				<Form onSubmit={handleSubmit}>
					<Form.Group controlId="email">
						<Form.Label>Email Address</Form.Label>
						<Form.Control
							type="email"
							placeholder="Enter email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Form.Group>
					<Form.Group controlId="password">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Enter password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Group>
					<Button type="submit" variant="primary">
						Sign In
					</Button>
				</Form>

				<Row className="py-3">
					<Col>
						New Customer?{" "}
						<Link
							to={redirect !== '/' ? `/register?redirect=${redirect}` : "/register"}
						>
							Register
						</Link>{" "}
					</Col>
				</Row>
			</>
		</FormContainer>
	);
};

export default Loginpage;
