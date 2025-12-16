# E-Commerce Server Template

A production-ready NestJS e-commerce backend template with MongoDB support and mock data for portfolio demonstration. This project demonstrates clean architecture, repository pattern, and dependency injection while being safe for public GitHub release.

## 🚀 Features

- **NestJS Framework** - Modern, scalable Node.js backend
- **Repository Pattern** - Clean separation of data access logic
- **Mock Data Support** - Runs without MongoDB using in-memory repositories
- **MongoDB Ready** - Easy switch to real MongoDB when needed
- **TypeScript** - Full type safety
- **RESTful API** - Well-structured endpoints
- **Comprehensive Testing** - Jest tests with mocked repositories

## 📋 Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: MongoDB (optional, with Mongoose ODM)
- **Testing**: Jest
- **Image Storage**: Cloudinary (optional)
- **Email**: Nodemailer (optional)

## 🏗️ Architecture

### Repository Pattern

The project uses a repository pattern to abstract data access:

```
src/
├── repositories/
│   ├── interfaces/          # Repository interfaces
│   ├── mocks/              # In-memory mock implementations
│   └── mongo/              # MongoDB implementations
├── modules/                 # Feature modules
│   ├── shop-items-v2/
│   ├── order/
│   ├── auth/
│   └── ...
```

**Key Benefits:**
- Services depend on interfaces, not implementations
- Easy to switch between mocks and real database
- Testable without database connections
- Clear separation of concerns

### Mock vs Real MongoDB

By default, the application uses **mock repositories** with in-memory data. This allows:
- ✅ Running without MongoDB setup
- ✅ Fast development and testing
- ✅ Safe for public GitHub repositories
- ✅ Deterministic test data

To use real MongoDB:
1. Set `MONGO_URI` environment variable
2. Ensure `USE_MOCK_REPOSITORIES` is not set to `'true'`

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env with your configuration (optional for mock mode)
```

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000

# MongoDB Configuration (optional - if not provided, mock repositories will be used)
# MONGO_URI=mongodb://localhost:27017/ecommerce

# Force use of mock repositories even if MONGO_URI is provided
# USE_MOCK_REPOSITORIES=true

# Email Configuration (for order notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@example.com

# Cloudinary Configuration (for image storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment & Redirect URLs
SUCCESS_REDIRECT_URL=http://localhost:3000/success
```

**Note**: All environment variables are optional. The application will run with mock data if MongoDB/Cloudinary credentials are not provided.

## 🏃 Running the Application

### Development Mode (with hot reload)

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Using Mock Repositories (Default)

The application runs with mock repositories by default. No MongoDB connection required!

```bash
npm run start:dev
# Server starts on http://localhost:8000
```

### Using Real MongoDB

1. Set up MongoDB (local or Atlas)
2. Add `MONGO_URI` to `.env`
3. Ensure `USE_MOCK_REPOSITORIES` is not set to `'true'`
4. Start the application

```bash
# .env
MONGO_URI=mongodb://localhost:27017/ecommerce
# Don't set USE_MOCK_REPOSITORIES or set it to 'false'
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

Tests use mocked repositories and don't require MongoDB.

## 📚 API Endpoints

### Shop Items V2

- `GET /api/shop-items-v2` - Get all products
- `GET /api/shop-items-v2/:id` - Get product by ID
- `GET /api/shop-items-v2/category/:category` - Get products by category
- `GET /api/shop-items-v2/collection/:collection` - Get products by collection
- `POST /api/shop-items-v2` - Create product
- `PATCH /api/shop-items-v2/:id` - Update product
- `DELETE /api/shop-items-v2/:id` - Delete product

### Orders

- `GET /api/order` - Get all orders
- `POST /api/order` - Create order
- `DELETE /api/order/:id` - Delete order
- `GET /api/order/by-email?email=...` - Find orders by email

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Promos

- `GET /api/promos/:code` - Get promo by code
- `POST /api/promos` - Create promo

### Certificates

- `GET /api/certificates` - Get all certificates
- `GET /api/certificates/:code` - Get certificate by code
- `POST /api/certificates` - Create certificate
- `DELETE /api/certificates/:code` - Delete certificate

## 🔄 Switching to Real MongoDB

The codebase is designed to easily switch from mocks to real MongoDB:

1. **Update Environment Variables**
   ```env
   MONGO_URI=mongodb://your-connection-string
   USE_MOCK_REPOSITORIES=false  # or remove this line
   ```

2. **MongoDB Repositories Already Implemented**
   - All MongoDB repository implementations exist in `src/repositories/mongo/`
   - They follow the same interfaces as mock repositories
   - No code changes needed!

3. **Module Configuration**
   - Modules automatically detect MongoDB configuration
   - Factory pattern selects the appropriate repository
   - See `src/shop-items-v2/shop-items-v2.module.ts` for example

## 🧩 Project Structure

```
src/
├── app.module.ts              # Root module
├── main.ts                    # Application entry point
├── repositories/              # Repository pattern implementation
│   ├── interfaces/            # Repository interfaces
│   ├── mocks/                 # Mock implementations
│   └── mongo/                 # MongoDB implementations
├── shop-items-v2/            # Product management (v2)
│   ├── dto/                   # Data transfer objects
│   ├── schemas/               # Mongoose schemas
│   ├── shop-items-v2.controller.ts
│   ├── shop-items-v2.service.ts
│   └── shop-items-v2.module.ts
├── order/                     # Order management
├── auth/                      # Authentication
├── promos/                    # Promo codes
├── certificates/              # Gift certificates
├── cloudinary/               # Image storage service
├── media/                    # Media upload handling
└── utils/                    # Utility functions
```

## 🔒 Security Notes

This template is designed for **public GitHub release**:

- ✅ No hardcoded secrets or credentials
- ✅ All sensitive data via environment variables
- ✅ Mock data for safe demonstration
- ✅ Generic placeholder names (no real brands)
- ✅ `.env` file in `.gitignore`

## 🛠️ Development

### Adding a New Repository

1. Create interface in `src/repositories/interfaces/`
2. Implement mock repository in `src/repositories/mocks/`
3. Implement MongoDB repository in `src/repositories/mongo/`
4. Update module to provide repository with factory pattern

Example:
```typescript
// src/repositories/interfaces/my-entity.repository.interface.ts
export interface IMyEntityRepository {
  findAll(): Promise<MyEntity[]>;
  findById(id: string): Promise<MyEntity | null>;
}

// src/repositories/mocks/mock-my-entity.repository.ts
@Injectable()
export class MockMyEntityRepository implements IMyEntityRepository {
  private entities: MyEntity[] = [/* mock data */];
  // ... implement methods
}

// In module:
{
  provide: 'MY_ENTITY_REPOSITORY',
  useFactory: (configService: ConfigService, mongoRepo: MongoMyEntityRepository) => {
    if (shouldUseMocks(configService)) {
      return new MockMyEntityRepository();
    }
    return mongoRepo;
  },
  inject: [ConfigService, MongoMyEntityRepository],
}
```

## 📝 License

This project is open source and available for portfolio use.

## 🤝 Contributing

This is a template project. Feel free to fork and adapt for your needs!

## 📧 Support

For questions or issues, please open a GitHub issue.

---

**Built with ❤️ using NestJS**
