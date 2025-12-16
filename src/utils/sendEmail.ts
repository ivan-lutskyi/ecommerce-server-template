import { createTransport } from 'nodemailer';
import { CreatePromoDto } from '../promos/dto/create-promo.dto';

// Product IDs that use two-size system (XS-S, M-L) instead of four sizes
// In production, this would be stored in the database per product
export const TWO_SIZED_ITEM_IDS: string[] = [];

// Product IDs that are one-size only
// In production, this would be stored in the database per product
export const ONE_SIZE_ITEM_IDS: string[] = [];

enum FourSizeToTwoSize {
  XS = 'XS-S',
  S = 'XS-S',
  M = 'M-L',
  L = 'M-L',
}

const getSizeLabelById = (id: string, size: string) => {
  if (TWO_SIZED_ITEM_IDS.includes(id)) {
    return FourSizeToTwoSize[size];
  } else if (ONE_SIZE_ITEM_IDS.includes(id)) {
    return 'One size';
  }

  return size;
};

const transporter = createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
});

const sendOrderUaEmail = (
  {
    email,
    fullName,
    phone,
    city,
    novaPoshta,
    items,
    price,
    promo,
    currency,
  }: {
    email: string;
    fullName: string;
    phone: string;
    city: string;
    novaPoshta: string;
    items: {
      id: string;
      size?: string;
      title: string;
      additionalParams?: string[];
    }[];
    price: number;
    promo: CreatePromoDto | null;
    currency: 'uah' | 'eur';
  },
  sendToAdminOnly?: boolean,
) => {
  const html = `
<!DOCTYPE html>
<html>

<head>
  <style>
    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }

    td,
    th {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }

    tr:nth-child(even) {
      background-color: #dddddd;
    }
  </style>
</head>

<body>
  <h3>Thanks for your order!</h3>
  <p>Your order has been received and is already being processed. Details of the order you can see below.
    As soon as your order is shipped, you will receive a consignment note number.</p>
  
  <ul>
    <li>Email: <strong>${email}</strong></li>
    <li>Full name: <strong>${fullName}</strong></li>
    <li>Phone: <strong>${phone}</strong></li>
    <li>City: <strong>${city}</strong></li>
    <li>Nova Poshta: <strong>${novaPoshta}</strong></li>
    <li>Promo code: <strong>${
      promo ? `${promo.name}, ${promo.discount}` : 'No promo used'
    }</strong></li>
  </ul>

  <h3>Order details:</h3>
  ${items
    .map(
      (el) =>
        `<h4>${el.title} (${el.id}) ${
          el.size ? `[Size: ${getSizeLabelById(el.id, el.size)}]` : ''
        } ${
          el.additionalParams && el.additionalParams.length
            ? el.additionalParams.join(', ')
            : ''
        }<h4>`,
    )
    .join('; ')
    .split('; ')
    .join('<br />')}

  <h3>Total price: ${price} ${currency}</h3>
</body>

</html>
`;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const fromEmail = process.env.EMAIL_USER || 'noreply@example.com';
  
  if (sendToAdminOnly) {
    const messageToAdmin = {
      from: fromEmail,
      to: adminEmail,
      subject: '[unapproved] New order',
      html,
    };
    transporter.sendMail(messageToAdmin, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  } else {
    const messageToAdmin = {
      from: fromEmail,
      to: adminEmail,
      subject: 'New order',
      html,
    };
    const messageToClient = {
      from: fromEmail,
      to: email,
      subject: 'Your order',
      html,
    };
    transporter.sendMail(messageToAdmin, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
    transporter.sendMail(messageToClient, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
};

const sendOrderWwEmail = (
  email: string,
  fullName: string,
  phone: string,
  city: string,
  countryCityRegion: string,
  postalCode: string,
  address: string,
  items: {
    id: string;
    size?: string;
    title: string;
    additionalParams?: string[];
  }[],
  price: number,
  promo: CreatePromoDto | null,
  currency: 'uah' | 'eur',
) => {
  const html = `
<!DOCTYPE html>
<html>

<head>
</head>

<body>
  <h3>Thanks for your order!</h3>
  <p>Your order has been received and is already being processed. Details of the order you can see below.
    As soon as your order is shipped, you will receive a consignment note number.</p>

  <ul>
    <li>Email: <strong>${email}</strong></li>
    <li>Full name: <strong>${fullName}</strong></li>
    <li>Phone: <strong>${phone}</strong></li>
    <li>City: <strong>${city}</strong></li>
    <li>Country, city, region: <strong>${countryCityRegion}</strong></li>
    <li>Postal code: <strong>${postalCode}</strong></li>
    <li>Address: <strong>${address}</strong></li>
    <li>Promo code: <strong>${
      promo ? `${promo.name}, ${promo.discount}` : 'No promo used'
    }</strong></li>
  </ul>

  <h3>Order details:</h3>
  ${items
    .map(
      (el) =>
        `<h4>${el.title} (${el.id}) ${
          el.size ? `[Size: ${getSizeLabelById(el.id, el.size)}]` : ''
        } ${
          el.additionalParams && el.additionalParams.length
            ? el.additionalParams.join(', ')
            : ''
        }<h4>`,
    )
    .join('; ')
    .split('; ')
    .join('<br />')}

  <h3>Total price: ${price} ${currency}</h3>
</body>

</html>
`;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const fromEmail = process.env.EMAIL_USER || 'noreply@example.com';
  
  const messageToAdmin = {
    from: fromEmail,
    to: adminEmail,
    subject: 'New order',
    html,
  };
  const messageToClient = {
    from: fromEmail,
    to: email,
    subject: 'Your order',
    html,
  };
  transporter.sendMail(messageToAdmin, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
  transporter.sendMail(messageToClient, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

const sendSupportEmail = (email: string, fullname: string, message: string) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  
  const messageData = {
    from: email,
    to: adminEmail,
    subject: 'Support Request',
    html: `
<!DOCTYPE html>
<html>

<head>
</head>

<body>
  <h3>Email: <p>${email}<p>
  </h3></br>
  <h3>Fullname: </h3>
  <p>${fullname}</p></br>
  <h3>Message:</h3>
  <p>${message}</p>
</body>

</html>
`,
  };

  transporter.sendMail(messageData, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export { sendOrderUaEmail, sendOrderWwEmail, sendSupportEmail };
