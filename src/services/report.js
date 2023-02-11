// setup Header
export function generateHeader(doc) {
  doc
    .image("logo.png", 50, 45, { width: 100 })
    .fillColor("##000000")
    .fontSize(20)
    .text("Damen E-Payment.", 170, 59)
    .fontSize(10)
    .text("6th of October City, Giza, Egypt", 200, 65, { align: "right" })
    .moveDown();
}

// setup CustomerInformation orders
export function generateCustomerInformation(doc, report) {
  doc
    .text(`orders Number: ${report.orders.length}`, 50, 150)
    .text(`report Date: ${new Date().toDateString()}`, 50, 165)

    .moveDown();
}

// generation of  orders and products tables
function generateTableRow(doc, y, c1, c2, c3, c4, c5, type) {
  if (type == "orders") {
    return doc
      .fontSize(10)
      .fillColor("#000000")
      .text(c1, 55, y)
      .text(c2, 143, y)
      .text(c3, 260, y)
      .text(c4, 350, y)
      .fontSize(10)
      .text(c5, 450, y);
  } else if (type == "products") {
    return doc
      .fontSize(10)
      .fillColor("#000000")
      .text(c1, 55, y)
      .text(c2, 143, y)
      .text(c3, 237, y)
      .text(c4, 327, y)
      .fontSize(10)
      .text(c5, 430, y);
  }
}

// generation of Report Body
export function generateReportBody(doc, report) {
  let i,
    height = 106,
    reportTableTop = 280;
  let index = 0;
  if (report.orders.length) {
    doc
      .fontSize(40)
      .text("Orders of Day", 50, 216, { align: "center" })
      .fontSize(15)
      .fillColor("#353dab")
      .text("Name", 50, 280, { align: "left" })
      .text("Address", 140, 280)
      .text("Quantity", 230, 280)
      .text("productCode", 320, 280)
      .text("createdAt", 440, 280);

    for (i = 0; i < report.orders.length; i++) {
      const order = report.orders[i];
      let position = reportTableTop + (index + 1) * 30;
      index++;
      if (position > 770) {
        index = 0;
        reportTableTop = 40;
        position = 40;
        doc.addPage();
      }
      height = position;

      generateTableRow(
        doc,
        position,
        order.Name,
        order.Address,
        order.Quantity,
        order.productCode,
        order.createdAt.toLocaleTimeString(),
        "orders"
      );
    }
    doc.moveDown();
    doc
      .fontSize(11)
      .text(
        `______________________________________________________________________`,
        50,
        height + 15,
        { align: "center" }
      )
      .moveDown();
  }
  if (height > 400) {
    height = -70;
    doc.addPage();
  }
  doc
    .text(
      `Products with Zero Quantity Number: ${report.products.length}`,
      50,
      height + 110
    )
    .moveDown();

  if (!report.products.length) {
    return 0;
  }
  console.log(height);
  // products with zero quantity
  doc
    .fontSize(20)
    .text("Products with Zero Quantity", 50, height + 161, { align: "center" })
    .fontSize(15)
    .fillColor("#353dab")
    .text("Code", 50, height + 225, { align: "left" })
    .text("Name", 140, height + 225)
    .text("Category", 230, height + 225)
    .text("Trademark", 320, height + 225)
    .text("updatedAt", 440, height + 225)
    .moveDown();

  height += 225;
  index = 0;
  reportTableTop = height;
  for (i = 0; i < report.products.length; i++) {
    const product = report.products[i];
    let position = reportTableTop + (index + 1) * 30;
    index++;
    if (position > 770) {
      index = 0;
      reportTableTop = 40;
      position = 40;
      doc.addPage();
    }
    height = position;
    generateTableRow(
      doc,
      position,
      product.Code,
      product.Name,
      product.Category,
      product.Trademark,
      product.updatedAt.toLocaleString(),
      "products"
    );
  }
  doc
    .fontSize(11)
    .text(
      `______________________________________________________________________`,
      50,
      height + 15,
      { align: "center" }
    )
    .moveDown();
  doc.moveDown();
}
