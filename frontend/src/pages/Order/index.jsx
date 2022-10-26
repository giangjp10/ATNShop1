import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButton } from "react-paypal-button-v2";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import Message from "../../components/Message/Message";
import Loader from "../../components/Loader/Loader";
import {
	getOrder,
	markOrderAsDelivered,
	resetOrder,
	updateOrderToPaid,
} from "../../store/slices/order.slice";

const Order = ({ history, match }) => {
	const [sdkReady, setSdkReady] = useState(false);
	const dispatch = useDispatch();
	const {
		authReducer: { authenticated, userInfo },
		orderReducer: {
			order,
			orderDetailsFailed,
			loading,
			orderPaySuccess,
			// orderPayFailed,
		},
	} = useSelector((state) => state);

	const addPayPalScript = async () => {
		const { data } = await axios.get("/api/config/paypal");

		const script = document.createElement("script");
		script.type = "text/javascript";
		script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
		script.async = true;
		script.onload = () => {
			setSdkReady(true);
		};

		document.body.appendChild(script);
	};

	useEffect(() => {
		!match?.params?.id && history.push("/");
		!authenticated && history.push("/login");
	}, [authenticated, history, match]);

	useEffect(() => {
		match?.params?.id && dispatch(getOrder(match.params.id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (orderPaySuccess) {
			dispatch(resetOrder());
			dispatch(getOrder(match?.params?.id));
		}
	}, [dispatch, match.params.id, order, orderPaySuccess]);

	useEffect(() => {
		addPayPalScript();
	}, []);

	const onPaymentSuccess = (paymentResult) => {
		dispatch(updateOrderToPaid(match?.params?.id, paymentResult));
	};

	const markasDelivered = () => {
		order?._id && dispatch(markOrderAsDelivered(order?._id));
	};

	return (
		<>
			{loading ? (
				<Loader />
			) : orderDetailsFailed ? (
				<Message variant="danger">{orderDetailsFailed}</Message>
			) : (
				<>
					<h1>{order?._id}</h1>
					<Row>
						<Col md={8}>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<h2>Shipping</h2>
									<p>
										<strong>Name: </strong> {order?.user?.name}
									</p>
									<p>
										<strong>Email: </strong>
										<a href={`mailto:${order?.user?.email}`}>
											{order?.user?.email}
										</a>
									</p>
									<p>
										<strong>Address: &nbsp;</strong>
										{order?.shippingAddress?.address},{" "}
										{order?.shippingAddress?.city},{" "}
										{order?.shippingAddress?.postalCode},{" "}
										{order?.shippingAddress?.country}
									</p>
									{order?.isDelivered ? (
										<Message variant="success">
											Delivered on {order?.deliveredAt}
										</Message>
									) : (
										<Message variant="danger"> Not Delivered</Message>
									)}
								</ListGroup.Item>

								<ListGroup.Item>
									<h2>Payment Method</h2>
									<p>
										<strong>Method: &nbsp;</strong>
										{order?.paymentMethod}
									</p>
									{order?.isPaid ? (
										<Message variant="success">Paid on {order?.paidAt}</Message>
									) : (
										<Message variant="danger"> Not Paid</Message>
									)}
								</ListGroup.Item>

								<ListGroup.Item>
									<h2>Orders</h2>
									{!order?.orderItems?.length ? (
										<Message>Your order is empty!</Message>
									) : (
										<ListGroup variant="flush">
											{order?.orderItems.map((item) => (
												<ListGroup.Item key={item?._id}>
													<Row>
														<Col md={1}>
															<Image
																src={item?.image}
																alt={item?.name}
																fluid
																rounded
															/>
														</Col>
														<Col>
															<Link to={item?._id}>{item?.name}</Link>
														</Col>
														<Col md={4}>
															{item?.qty} x ${item?.price} = $
															{item.price * item.qty}
														</Col>
													</Row>
												</ListGroup.Item>
											))}
										</ListGroup>
									)}
								</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col md={4}>
							<Card>
								<ListGroup variant="flush">
									<ListGroup.Item>
										<h2>Order Summary</h2>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Items</Col>
											<Col>${order?.itemsPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Shipping</Col>
											<Col>${order?.shippingPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Tax</Col>
											<Col>${order?.taxPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Total</Col>
											<Col>${order?.totalPrice}</Col>
										</Row>
									</ListGroup.Item>
									{!order?.isPaid && (
										<ListGroup.Item>
											{loading && <Loader />}
											{!sdkReady ? (
												<Loader />
											) : (
												<PayPalButton
													amount={order?.totalPrice}
													onSuccess={onPaymentSuccess}
												/>
											)}
										</ListGroup.Item>
									)}
									{userInfo?.isAdmin && order?.isPaid && !order?.isDelivered && (
										<ListGroup.Item>
											<Button
												disabled={loading}
												onClick={markasDelivered}
												type="button"
												className="btn btn-block"
											>
												Mark As Delivered
											</Button>
										</ListGroup.Item>
									)}
								</ListGroup>
							</Card>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default Order;
