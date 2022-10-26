import { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col, FormControl, Table } from "react-bootstrap";
import Message from "../../components/Message/Message";
import Loader from "../../components/Loader/Loader";
import {
	fetchProfile,
	updateProfile,
	getMyOrders,
} from "../../store/slices/user.slice";

const Profile = ({ history }) => {
	const dispatch = useDispatch();
	const {
		userProfileError,
		loading,
		profile,
		updateProfileError,
		myOrders,
	} = useSelector((state) => state.userReducer);
	const { authenticated } = useSelector((state) => state.authReducer);

	const [name, setName] = useState(profile?.name || "");
	const [email, setEmail] = useState(profile?.email || "");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState(null);

	useEffect(() => {
		!profile && dispatch(fetchProfile());
		!myOrders && dispatch(getMyOrders());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		!authenticated && history.push("/login");
		profile?.name && setName(profile?.name);
		profile?.email && setEmail(profile?.email);
	}, [history, authenticated, dispatch, profile, myOrders]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage("Passwords do not match");
		} else {
			dispatch(
				updateProfile({ name, email, password }, () => {
					window?.location?.reload();
				})
			);
		}
	};

	return (
		<Row>
			<Col md={3}>
				<h2>User Profile</h2>
				{loading && <Loader />}
				{updateProfileError && (
					<Message variant="danger">{updateProfileError}</Message>
				)}
				{userProfileError && (
					<Message variant="danger">{userProfileError}</Message>
				)}
				{message && <Message variant="danger">{message}</Message>}
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
						Update
					</Button>
				</Form>
			</Col>
			<Col>
				<h2>My Orders</h2>
				{loading ? (
					<Loader />
				) : (
					<Table className="table-sm" striped bordered hover responsive>
						<thead>
							<tr>
								<th>ID</th>
								<th>DATE</th>
								<th>TOTAL</th>
								<th>PAID</th>
								<th>DELIVERED</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{myOrders?.map((order) => (
								<tr key={order?._id}>
									<th>{order?._id}</th>
									<th>{order?.createdAt.substring(0, 10)}</th>
									<th>{order?.totalPrice}</th>
									<th>
										{order?.isPaid ? (
											order?.paidAt.substring(0, 10)
										) : (
											<i className="fas fa-times text-danger" />
										)}
									</th>
									<th>
										{order?.isDelivered ? (
											order?.deliveredAt.substring(0, 10)
										) : (
											<i className="fas fa-times text-danger" />
										)}
									</th>
									<th>
										<LinkContainer to={`/order/${order?._id}`}>
											<Button className="btn-sm" variant="light">
												Details
											</Button>
										</LinkContainer>
									</th>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</Col>
		</Row>
	);
};

export default Profile;
