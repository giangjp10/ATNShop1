import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, FormControl } from "react-bootstrap";
import Message from "../../../components/Message/Message";
import Loader from "../../../components/Loader/Loader";
import {
	getUserToEdit,
	updateUserAsAdmin,
} from "../../../store/slices/user.slice";
import FormContainer from "../../../components/FormContainer/FormContainer";

const EditUser = ({ match, history }) => {
	const userId = match?.params?.id;
	const dispatch = useDispatch();
	const {
		authReducer: { authenticated, userInfo },
		userReducer: {
			userToEdit,
			loading,
			updateUserSuccess,
			updateUserError: error,
		},
	} = useSelector((state) => state);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [isAdmin, setIsAdmin] = useState("");
	const [canSubmitForm, setCanSubmitForm] = useState(false);

	useEffect(() => {
		!authenticated && history.push("/login");
		!userInfo?.isAdmin && history.push("/");
	}, [history, authenticated, userInfo]);

	useEffect(() => {
		if (userId && !userToEdit) {
			dispatch(getUserToEdit(userId));
		}
		setName(userToEdit?.name);
		setEmail(userToEdit?.email);
		setIsAdmin(userToEdit?.isAdmin);
	}, [dispatch, userId, userToEdit]);

	useEffect(() => {
		if (name || email || isAdmin !== userToEdit?.isAdmin) {
			setCanSubmitForm(true);
		} else {
			setCanSubmitForm(false);
		}
	}, [email, isAdmin, name, userToEdit?.isAdmin]);

	useEffect(() => {
		updateUserSuccess && history.push("/admin/users");
	}, [history, updateUserSuccess]);

	const handleSubmit = (e) => {
		e.preventDefault();

		let newUser = { name, email, isAdmin };

		dispatch(updateUserAsAdmin(userId, newUser));
	};

	return (
		<>
			<Link className="btn btn-light my-3" to="/admin/users">
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit User Profile</h1>
				{error && <Message variant="danger">{error}</Message>}
				{loading ? (
					<Loader />
				) : (
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="name">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter name"
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
						<Form.Group controlId="isAdmin">
							<Form.Check
								type="checkbox"
								label="Make Admin"
								checked={isAdmin}
								onChange={(e) => setIsAdmin(e.target.checked)}
							/>
						</Form.Group>
						<Button disabled={!canSubmitForm} type="submit" variant="primary">
							Update
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	);
};

export default EditUser;
