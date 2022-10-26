import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Col } from "react-bootstrap";
import { savePaymentMethod } from "../../store/slices/cart.slice";
import FormContainer from "../../components/FormContainer/FormContainer";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";

const Payment = ({ history }) => {
	const dispatch = useDispatch();
	const {
		authReducer: { authenticated },
		cartReducer: { shippingAddress },
	} = useSelector((state) => state);
	const [paymentMethod, setPaymentMethod] = useState("PayPal");

	const handleSubmit = (e) => {
		e.preventDefault();

		dispatch(savePaymentMethod(paymentMethod));

		history.push("/order");
	};

	useEffect(() => {
		(!shippingAddress?.address || !authenticated) && history.push("/shipping");
	}, [authenticated, history, shippingAddress?.address]);

	return (
		<FormContainer>
			<CheckoutSteps step1 step2 step3 />
			<h1>Payment Method</h1>
			<Form onSubmit={handleSubmit}>
				<Form.Group>
					<Form.Label as="legend">Select Method</Form.Label>
					<Col>
						<Form.Check
							type="radio"
							label="PayPal or Credit Card"
							id="Paypal"
							value="PayPal"
							name="PaymentMethod"
							checked
							onChange={(e) => setPaymentMethod(e.target.value)}
						/>
						{/* <Form.Check
							type="radio"
							label="Stripe"
							id="Stripe"
							value="Stripe"
							name="PaymentMethod"
							onChange={(e) => setPaymentMethod(e.target.value)}
						/> */}
					</Col>
				</Form.Group>
				<Button type="submit" variant="primary">
					Continue
				</Button>
			</Form>
		</FormContainer>
	);
};

export default Payment;
