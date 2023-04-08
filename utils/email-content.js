module.exports = (fullName, phoneNumber, address, cart) => {
	const info = `
		<h2>Xin chào ${fullName}</h2>
		<p>Phone: ${phoneNumber}</p>
		<p>Address: ${address}</p>
	`;

	const total = `
		<h3>Tổng thanh toán: ${cart.total} VND</h3>
		<h3>Cảm ơn bạn!</h3>
	`;

	const tableRows = cart.items.map(item => {
		return `
			<tr>
				<td>${item.product.name}</td>
				<td>
					<img src='${item.product.img1}' alt='${item.product.name}' />
				</td>
				<td>${item.product.price} VND</td>
				<td>${item.qty}</td>
				<td>${item.product.price * item.qty}</td>
			</tr>
		`;
	});
	
	const table = `
		<table>
			<thead>
				<tr>
					<th>Tên sản phẩm</th>
					<th>Hình ảnh</th>
					<th>Giá</th>
					<th>Số lượng</th>
					<th>Thành tiền</th>
				</tr>
			</thead>
			<tbody>${tableRows.join('')}</tbody>
		</table>
	`;

	return `${info}${table}${total}`;
};
