import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
	Row,
	Col,
	Image,
	ListGroup,
	Card,
	Button,
	Form,
} from "react-bootstrap";
import Rating from "../../components/Rating/Rating";
import {
	getProductDetails,
	reviewProduct,
	resetSelectedProduct,
} from "../../store/slices/product.slice";
import Loader from "../../components/Loader/Loader";
import Message from "../../components/Message/Message";

const Productpage = ({ match, history }) => {
	const dispatch = useDispatch();
	const {
		authReducer: { authenticated, userInfo },
		productReducer: { loading, product, error, reviewError },
	} = useSelector((state) => state);
	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	useEffect(() => {
		dispatch(getProductDetails(match?.params?.id));
	}, [dispatch, match]);

	useEffect(() => {
		return () => {
			dispatch(resetSelectedProduct());
		};
	}, [dispatch]);

	const addToCart = () => {
		history.push(`/cart/${match?.params?.id}?qty=${qty}`);
	};

	const qtyOptions = (count) => {
		let options = [];
		for (let i = 1; i <= count; i++) {
			options.push(i);
		}

		return options;
	};

	const submitHandler = (e) => {
		e.preventDefault();

		dispatch(reviewProduct(product?._id, { rating, comment }));
	};

	const findUserReview = () => {
		return product?.reviews?.find((review) => review?.user === userInfo?._id);
	};

	return (
		<>
			<Button
				className="btn btn-light my-3"
				onClick={() => {
					dispatch(resetSelectedProduct());
					history.push("/");
				}}
			>
				Go Back
			</Button>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<>
					<Row>
						<Col md={6}>
							<Image fluid src={product?.image} alt={product?.name} />
						</Col>
						<Col md={3}>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<h3 className="pb-2">{product?.name}</h3>
								</ListGroup.Item>
								<ListGroup.Item>
									<Rating
										value={product?.rating}
										text={`${product?.numReviews} reviews`}
									/>
								</ListGroup.Item>
								<ListGroup.Item>Price: ${product?.price}</ListGroup.Item>
								<ListGroup.Item>
									Description: {product?.description}
								</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col md={3}>
							<Card>
								<ListGroup variant="flush">
									<ListGroup.Item>
										<Row>
											<Col>Price:</Col>
											<Col>
												<strong>${product?.price}</strong>
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Status:</Col>
											<Col>
												{product?.countInStock > 0
													? "In Stock"
													: "Out Of Stock"}
											</Col>
										</Row>
									</ListGroup.Item>
									{product?.countInStock > 0 && (
										<ListGroup.Item>
											<Row>
												<Col>Qty</Col>
												<Col>
													<Form.Control
														as="select"
														value={qty}
														onChange={(e) => setQty(e.target.value)}
													>
														{qtyOptions(product?.countInStock)?.map(
															(option, id) => (
																<option key={id} value={option}>
																	{option}
																</option>
															)
														)}
													</Form.Control>
												</Col>
											</Row>
										</ListGroup.Item>
									)}
									<ListGroup.Item>
										<Button
											onClick={addToCart}
											disabled={!product?.countInStock > 0}
											type="button"
											className="btn-block"
										>
											ADD TO CART
										</Button>
									</ListGroup.Item>
								</ListGroup>
							</Card>
						</Col>
					</Row>
					<Row className="mt-4">
						<Col md={6}>
							<h2>Reviews</h2>
							{product?.reviews?.length === 0 && <Message>No Review</Message>}
							{reviewError && <Message>Something went wrong, please refresh and try again</Message>}
							<ListGroup variant="flush">
								{product?.reviews?.map((review) => (
									<ListGroup.Item key={review?._id}>
										<strong>{review?.name}</strong>
										<Rating value={review?.rating} />
										<p>{review?.createdAt?.substring(0, 10)}</p>
										<p>{review?.comment}</p>
									</ListGroup.Item>
								))}
								<ListGroup.Item>
									{userInfo && findUserReview() ? (
										<Message>You've reviewed this product previously!</Message>
									) : (
										<>
											{" "}
											<h5>Write a customer review.</h5>
											{authenticated ? (
												<Form onSubmit={submitHandler}>
													<Form.Group controlId="rating">
														<Form.Label>Rating</Form.Label>
														<Form.Control
															as="select"
															value={rating}
															onChange={(e) => setRating(e.target.value)}
														>
															<option value="">Select...</option>
															<option value="1">1 - Poor</option>
															<option value="2">2 - Fair</option>
															<option value="3">3 - Good</option>
															<option value="4">4 - Very Good</option>
															<option value="5">5 - Excellent</option>
														</Form.Control>
													</Form.Group>
													<Form.Group controlId="comment">
														<Form.Label>Comment</Form.Label>
														<Form.Control
															as="textarea"
															row="3"
															value={comment}
															onChange={(e) => setComment(e.target.value)}
														/>
													</Form.Group>
													<Button
														disabled={loading || !comment || !rating}
														type="submit"
														variant="primary"
													>
														Submit
													</Button>
												</Form>
											) : (
												<Message>
													Please <Link to="/login">login</Link> to add a review
												</Message>
											)}{" "}
										</>
									)}
								</ListGroup.Item>
							</ListGroup>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default Productpage;
