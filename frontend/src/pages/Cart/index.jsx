import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../store/slices/cart.slice";
import {
	Row,
	Col,
	ListGroup,
	Image,
	Form,
	Button,
	Card,
} from "react-bootstrap";
import Message from "../../components/Message/Message";

const Cart = ({ match, location, history }) => {
	const dispatch = useDispatch();
	const { cartItems } = useSelector((state) => state.cartReducer);
	const productId = match?.params?.id;
	const qty = location.search ? Number(location.search.split("=")[1]) : 1;

	useEffect(() => {
		productId && dispatch(addToCart(productId, qty));
	}, [dispatch, productId, qty]);

	const qtyOptions = (count) => {
		let options = [];
		for (let i = 1; i <= count; i++) {
			options.push(i);
		}

		return options;
	};

	const handleCheckout = () => {
		history.push("/login?redirect=shipping");
	};

	return (
		<Row>
			<Col md={8}>
				<h1>Shopping Cart</h1>
				{!cartItems.length ? (
					<Message>
						Your cart is empty <Link to="/">Go back</Link>{" "}
					</Message>
				) : (
					<ListGroup variant="flush">
						{cartItems.map((item) => (
							<ListGroup.Item key={item?.id}>
								<Row>
									<Col md={2}>
										<Image fluid src={item?.image} alt={item?.name} />
									</Col>
									<Col md={3}>
										<Link to={`/product/${item?.id}`}>{item?.name}</Link>
									</Col>
									<Col md={2}>${item?.price}</Col>
									<Col md={2}>
										<Form.Control
											as="select"
											value={item?.qty}
											onChange={(e) =>
												dispatch(addToCart(item?.id, Number(e.target.value)))
											}
										>
											{qtyOptions(item?.countInStock)?.map((option, id) => (
												<option key={id} value={option}>
													{option}
												</option>
											))}
										</Form.Control>
									</Col>
									<Col md={2}>
										<Button
											onClick={() => dispatch(removeFromCart(item?.id))}
											type="button"
											variant="light"
										>
											<i className="fas fa-trash" />
										</Button>
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
			</Col>
			<Col md={4}>
				<Card>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h2>
								Subtotal (
								{cartItems.reduce((acc, curItem) => acc + curItem.qty, 0)})
								items
							</h2>
							$
							{cartItems
								.reduce((acc, curItem) => acc + curItem.qty * curItem.price, 0)
								.toFixed(2)}
						</ListGroup.Item>
						<ListGroup.Item>
							<Button
								type="button"
								className="btn-block"
								disabled={!cartItems.length}
								onClick={handleCheckout}
							>
								Proceed to Checkout
							</Button>
						</ListGroup.Item>
					</ListGroup>
				</Card>
			</Col>
		</Row>
	);
};

export default Cart;
