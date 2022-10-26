import { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from "react-bootstrap";
import Message from "../../../components/Message/Message";
import Loader from "../../../components/Loader/Loader";
import { fetchAllUsers, deleteUser } from "../../../store/slices/user.slice";

const AllUsers = ({ history }) => {
	const dispatch = useDispatch();
	const {
		authReducer: { authenticated, userInfo },
		userReducer: {
			users,
			usersListLoading,
			fetchUsersError: error,
			deleteUserSuccess,
			deleteUserFailed,
		},
	} = useSelector((state) => state);

	useEffect(() => {
		!authenticated
			? history.push("/login")
			: !userInfo.isAdmin
			? history.push("/")
			: dispatch(fetchAllUsers());
	}, [authenticated, dispatch, history, userInfo]);

	const deleteHandler = (id, name) => {
		if (id) {
			const confirmDelete = window.confirm(`Sure you want to delete ${name}?`);
			confirmDelete && dispatch(deleteUser(id));
		}
	};

	useEffect(() => {
		deleteUserSuccess && dispatch(fetchAllUsers());
	}, [deleteUserSuccess, dispatch]);

	return (
		<div>
			<h1>Users</h1>
			{deleteUserSuccess && (
				<Message variant="success">{deleteUserSuccess}</Message>
			)}
			{usersListLoading ? (
				<Loader />
			) : error || deleteUserFailed ? (
				<Message variant="danger">{error || deleteUserFailed}</Message>
			) : (
				<Table className="table-sm" striped bordered hover responsive>
					<thead>
						<tr>
							<td>ID</td>
							<td>NAME</td>
							<td>EMAIL</td>
							<td>ADMIN</td>
							<td></td>
						</tr>
					</thead>
					<tbody>
						{users?.length ? (
							users?.map((user) => (
								<tr key={user?._id}>
									<td>{user?._id}</td>
									<td>{user?.name}</td>
									<td>
										<a href={`mailto:${user?.email}`}>{user?.email}</a>
									</td>
									<td>
										{user?.isAdmin ? (
											<i className="fas fa-check text-success" />
										) : (
											<i className="fas fa-times text-danger" />
										)}
									</td>
									<td>
										<LinkContainer to={`/admin/user/${user._id}/edit`}>
											<Button className="btn-sm" variant="light">
												<i className="fas fa-edit" />
											</Button>
										</LinkContainer>
										<Button
											onClick={() => deleteHandler(user?._id, user?.name)}
											className="btn-sm"
											variant="danger"
										>
											<i className="fas fa-trash" />
										</Button>
									</td>
								</tr>
							))
						) : (
							<Message variant="info">No User</Message>
						)}
					</tbody>
				</Table>
			)}
		</div>
	);
};

export default AllUsers;
