// Helpers to convert between SQLite row shape (flat, JSON-as-TEXT columns)
// and the JS shapes the app already works with (InventoryProduct, Order).

export function rowToProduct(row: any) {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.category,
    fabricType: row.fabricType,
    material: row.material,
    gsm: row.gsm,
    width: row.width,
    weave: row.weave,
    finish: row.finish,
    origin: row.origin,
    pricePerMeter: row.pricePerMeter,
    moq: row.moq,
    stock: row.stock,
    colors: row.colors ? JSON.parse(row.colors) : [],
    description: row.description,
    image: row.image,
    bulkTiers: row.bulkTiers ? JSON.parse(row.bulkTiers) : [],
    status: row.status,
    addedOn: row.addedOn,
    addedTimestamp: row.addedTimestamp,
    source: row.source,
    ...(row.extra ? JSON.parse(row.extra) : {}),
  };
}

export function rowToOrder(row: any, items: any[]) {
  return {
    id: row.id,
    date: row.date,
    timestamp: row.timestamp,
    supplier: row.supplier,
    supplierVerified: !!row.supplierVerified,
    location: row.location,
    items: items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      pricePerMeter: i.pricePerMeter,
    })),
    amount: row.amount,
    status: row.status,
    deliveryDate: row.deliveryDate,
    paymentMethod: row.paymentMethod,
    buyerCompany: row.buyerCompany,
    buyerEmail: row.buyerEmail,
    buyerPhone: row.buyerPhone,
    buyerVerified: row.buyerVerified === null ? undefined : !!row.buyerVerified,
    shippingAddress: row.shippingAddress,
    billingAddress: row.billingAddress,
    gstin: row.gstin,
    orderNotes: row.orderNotes,
    paymentStatus: row.paymentStatus,
    activityLog: row.activityLog ? JSON.parse(row.activityLog) : [],
  };
}
