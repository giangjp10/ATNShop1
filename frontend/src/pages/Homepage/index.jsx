import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Product from "../../components/Product/Product";
import { getProductList } from "../../store/slices/products.slice";
import Loader from "../../components/Loader/Loader";
import Message from "../../components/Message/Message";
import Pagination from "../../components/Pagination/Pagination";
import ProductCarousel from "../../components/ProductsCarousel/ProductCarousel";

const HomePage = ({ match }) => {
	const keyword = match.params.keyword;
	const dispatch = useDispatch();
	const { products, loading, error } = useSelector(
		(state) => state.productListReducer
	);
	const [pageNum, setPageNum] = useState(1);

	useEffect(() => {
		dispatch(getProductList(keyword, pageNum));
	}, [dispatch, keyword, pageNum]);

	return (
		<>
			{!keyword ? (
				<ProductCarousel />
			) : (
				<Link className="btn btn-light my-3" to="/">
					Go Back
				</Link>
			)}
			<h1 className="mt-3 mb-4">Latest Products</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<>
					<Row>
						{products?.products?.map((product) => (
							<Col key={product?._id} sm={12} md={6} lg={4} xl={3}>
								<Product product={product} />
							</Col>
						))}
					</Row>
					<Pagination
						keyword={keyword}
						page={products?.page}
						pages={products?.pages}
						setPageNum={setPageNum}
					/>
				</>
			)}
		</>
	);
};

export default HomePage;
