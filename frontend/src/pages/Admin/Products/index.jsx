import { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Row, Col } from "react-bootstrap";
import Message from "../../../components/Message/Message";
import Loader from "../../../components/Loader/Loader";
import {
	getProductList,
	deleteProduct,
} from "../../../store/slices/products.slice";
import { createProduct } from "../../../store/slices/product.slice";
import Paginate from "../../../components/Pagination/Pagination";

const AllProducts = ({ history }) => {
	const dispatch = useDispatch();
	const [pageNum, setPageNum] = useState(1);
	const {
		authReducer: { authenticated, userInfo },
		productListReducer: {
			loading,
			error,
			products,
			deleteProductSuccess,
			deleteProductError,
		},
		productReducer: { newProduct, loading: creatingProduct },
	} = useSelector((state) => state);

	useEffect(() => {
		!authenticated
			? history.push("/login")
			: !userInfo.isAdmin
			? history.push("/")
			: dispatch(getProductList("", pageNum));
	}, [authenticated, dispatch, history, pageNum, userInfo]);

	const deleteHandler = (id, name) => {
		if (id) {
			const confirmDelete = window.confirm(`Do you want to delete ${name}?`);

			confirmDelete && dispatch(deleteProduct(id));
		}
	};

	useEffect(() => {
		deleteProductSuccess && dispatch(getProductList());
	}, [deleteProductSuccess, dispatch]);

	useEffect(() => {
		newProduct?.name && history.push(`/admin/product/${newProduct?._id}/edit`);
	}, [newProduct, dispatch, history]);

	return (
		<>
			<Row className="align-items-center">
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className="text-right">
					<Button onClick={() => dispatch(createProduct())} className="my-3">
						<i className="fas fas-plus" /> Create Product
					</Button>
				</Col>
			</Row>

			{error && <Message variant="success">{error}</Message>}
			{loading || creatingProduct ? (
				<Loader />
			) : deleteProductSuccess ? (
				<Message variant="danger">{deleteProductSuccess}</Message>
			) : error || deleteProductError ? (
				<Message variant="danger">{error || deleteProductError}</Message>
			) : (
				<Table className="table-sm" striped bordered hover responsive>
					<thead>
						<tr>
							<td>ID</td>
							<td>NAME</td>
							<td>PRICE</td>
							<td>CATEGORY</td>
							<td>BRAND</td>
							<td></td>
						</tr>
					</thead>
					<tbody>
						{products?.products?.length ? (
							products?.products?.map((product) => (
								<tr key={product?._id}>
									<td>{product?._id}</td>
									<td>{product?.name}</td>
									<td>{product?.price}</td>
									<td>{product?.category}</td>
									<td>{product?.brand}</td>
									<td>
										<LinkContainer to={`/admin/product/${product._id}/edit`}>
											<Button className="btn-sm" variant="light">
												<i className="fas fa-edit" />
											</Button>
										</LinkContainer>
										<Button
											onClick={() => deleteHandler(product?._id, product?.name)}
											className="btn-sm"
											variant="danger"
										>
											<i className="fas fa-trash" />
										</Button>
									</td>
								</tr>
							))
						) : (
							<Message variant="info">No Product</Message>
						)}
					</tbody>
				</Table>
			)}
			<Paginate
				page={products?.page}
				pages={products?.pages}
				setPageNum={setPageNum}
			/>
		</>
	);
};

export default AllProducts;
