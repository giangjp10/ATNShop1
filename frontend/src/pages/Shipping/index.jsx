import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { saveShippingAddress } from "../../store/slices/cart.slice";
import FormContainer from "../../components/FormContainer/FormContainer";
import CheckoutSteps from "../../components/CheckoutSteps/CheckoutSteps";

const Shipping = ({ history }) => {
	const dispatch = useDispatch();
	const {
		authReducer: { authenticated },
		cartReducer: { shippingAddress },
	} = useSelector((state) => state);
	const [address, setAddress] = useState(shippingAddress?.address);
	const [city, setCity] = useState(shippingAddress?.city);
	const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode);
	const [country, setCountry] = useState(shippingAddress?.country);

	const handleSubmit = (e) => {
		e.preventDefault();

		dispatch(
			saveShippingAddress({
				address,
				city,
				postalCode,
				country,
			})
		);

		history.push("/payment");
	};

	useEffect(() => {
		!authenticated && history.push("/login");
	}, [authenticated, history]);

	return (
		<FormContainer>
			<CheckoutSteps step1 step2 />
			<h1>Shipping</h1>
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="address">
					<Form.Label>Address</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter your address"
						value={address}
						required
						onChange={(e) => setAddress(e.target.value)}
					/>
				</Form.Group>
				<Form.Group controlId="city">
					<Form.Label>City</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter your city"
						value={city}
						onChange={(e) => setCity(e.target.value)}
					/>
				</Form.Group>
				<Form.Group controlId="postalCode">
					<Form.Label>PostalCode</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter your postalCode"
						value={postalCode}
						onChange={(e) => setPostalCode(e.target.value)}
					/>
				</Form.Group>
				<Form.Group controlId="country">
					<Form.Label>Country</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter your country"
						value={country}
						onChange={(e) => setCountry(e.target.value)}
					/>
				</Form.Group>
				<Button type="submit" variant="primary">
					Continue
				</Button>
			</Form>
		</FormContainer>
	);
};

export default Shipping;
