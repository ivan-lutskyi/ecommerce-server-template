# E-Commerce Server Template

> A production-ready, enterprise-grade NestJS e-commerce backend API demonstrating advanced software engineering practices, clean architecture, and scalable design patterns. Built with TypeScript, featuring comprehensive test coverage, repository pattern abstraction, and zero-dependency mock-first development approach.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red)](https://nestjs.com/)
[![Jest](https://img.shields.io/badge/Jest-Tested-green)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-Open%20Source-green)](LICENSE)

## 📖 About This Project

This is a **production-ready, enterprise-grade e-commerce backend API** built with NestJS that demonstrates advanced software engineering practices and real-world application architecture. The project showcases:

### Engineering Excellence

- **Clean Architecture** - Layered architecture with clear separation of concerns
- **Design Patterns** - Repository pattern, Dependency Injection, Factory pattern
- **SOLID Principles** - Single Responsibility, Open/Closed, Dependency Inversion
- **Test-Driven Development** - 91+ comprehensive unit tests covering all controllers and services
- **Type Safety** - Full TypeScript with strict mode and comprehensive type definitions
- **Scalability** - Modular design that scales horizontally
- **Maintainability** - Well-documented, self-documenting code structure

### Complete E-Commerce Solution

This API provides all essential features for running a production online store:

- **Product Management** - Full CRUD operations for shop items with multi-language support, categories, collections, and inventory tracking
- **Order Processing** - Order creation, approval workflow, inventory management, and email notifications
- **User Authentication** - Secure user registration and login with password hashing
- **Promo Codes** - Discount code system for promotions
- **Gift Certificates** - Digital certificate management system
- **Media Management** - Image and video upload to Cloudinary with optimization
- **Support System** - Contact form with email notifications
- **Payment Integration** - Ready for payment gateway integration (LiqPay/WayForPay structure)

The project is designed to run **out of the box** with mock data, making it perfect for:
- Portfolio demonstrations
- Learning NestJS architecture patterns
- Quick prototyping
- Template for new e-commerce projects

## 🚀 Key Features

### Architecture & Design Patterns

- **Repository Pattern** - Clean separation of data access logic with interface-based design
- **Dependency Injection** - Full NestJS DI container usage
- **Modular Structure** - Feature-based module organization
- **Type Safety** - Full TypeScript coverage with strict typing
- **Mock-First Development** - Runs without external dependencies

### Technical Features

- **Dual Repository System** - Switch between mock and MongoDB repositories via environment variables
- **Multi-language Support** - Products support English and Ukrainian translations
- **Inventory Management** - Real-time stock tracking with size-based availability
- **Email Notifications** - Automated order confirmation emails (Ukraine and worldwide shipping)
- **Media Optimization** - Automatic image/video optimization via Cloudinary
- **Comprehensive Testing** - 91+ unit tests covering all controllers, services, and endpoints
- **RESTful API** - Well-structured, REST-compliant endpoints

### Developer Experience

- **Zero Configuration** - Works immediately with mock data
- **Hot Reload** - Fast development with watch mode
- **Type Safety** - Full TypeScript with strict mode
- **Test Coverage** - Comprehensive test suite with mocked dependencies
- **Clean Code** - Follows NestJS best practices and SOLID principles

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

### Shop Items V2 (`/api/shop-items-v2`)

Complete product management system with multi-language support, categories, collections, and inventory.

- `GET /api/shop-items-v2` - Get all products (supports `?category=` and `?collection=` query params)
- `GET /api/shop-items-v2/:id` - Get product by ID
- `POST /api/shop-items-v2` - Create new product
- `POST /api/shop-items-v2/with-media` - Create product with image/video uploads
- `PUT /api/shop-items-v2/:id` - Update product details
- `PUT /api/shop-items-v2/:id/photos` - Update product photos
- `DELETE /api/shop-items-v2/:id` - Delete product (also removes Cloudinary assets)

**Product Features:**
- Multi-language titles and descriptions (English/Ukrainian)
- Price in multiple currencies (UAH/EUR)
- Discount pricing support
- Size-based inventory tracking (XS, S, M, L, XL)
- Category and collection organization
- Coming soon and sold out flags
- Position-based sorting

### Orders (`/api/order`)

Order processing system with inventory validation, approval workflow, and email notifications.

- `GET /api/order` - Get all orders
- `POST /api/order` - Create new order (validates inventory, sends notification emails)
- `GET /api/order/by-email?email=...` - Find orders by customer email
- `POST /api/order/approve` - Approve order from payment gateway callback
- `POST /api/order/approve/admin` - Manual admin approval
- `DELETE /api/order/:id` - Delete order
- `POST /api/order/success` - Payment success redirect endpoint
- `POST /api/order/email/test` - Test email sending

**Order Features:**
- Ukraine and worldwide shipping support
- Automatic inventory deduction on approval
- Promo code integration
- Email notifications (customer and admin)
- UTM tracking support
- Order approval workflow

### Authentication (`/api/auth`)

Secure user authentication with password hashing.

- `POST /api/auth/register` - Register new user account
- `POST /api/auth/login` - Login with email and password

**Security:**
- Bcrypt password hashing
- Password excluded from responses
- Input validation

### Promos (`/api/promos`)

Discount code management system.

- `GET /api/promos/:code` - Get promo code details
- `POST /api/promos` - Create new promo code

**Promo Features:**
- Percentage-based discounts
- Code validation
- Integration with order system

### Certificates (`/api/certificates`)

Digital gift certificate management.

- `GET /api/certificates/:code` - Get certificate by code
- `POST /api/certificates` - Create new certificate

**Certificate Features:**
- Unique code generation
- Amount tracking
- Owner assignment
- Expiration support

### Media (`/api/media`)

File upload and management with Cloudinary integration.

- `POST /api/media/shop-items/:id/upload` - Upload product images/videos
- `POST /api/media/banners/upload/:bannerName` - Upload banner media
- `DELETE /api/media/:publicId` - Delete media from Cloudinary

**Media Features:**
- Automatic image optimization
- Video support
- Custom naming conventions
- Cloudinary integration

### Support (`/api/support`)

Customer support contact form.

- `POST /api/support` - Send support request email

**Support Features:**
- Email validation
- Admin notification
- Form validation

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
├── app.module.ts              # Root module - orchestrates all feature modules
├── main.ts                    # Application entry point - bootstrap and server configuration
│
├── repositories/              # Repository pattern implementation
│   ├── interfaces/            # Repository interfaces (contracts)
│   │   ├── shop-item-v2.repository.interface.ts
│   │   ├── order.repository.interface.ts
│   │   ├── user.repository.interface.ts
│   │   ├── promo.repository.interface.ts
│   │   └── certificate.repository.interface.ts
│   ├── mocks/                 # In-memory mock implementations
│   │   └── (mock-*.repository.ts files with sample data)
│   ├── mongo/                 # MongoDB implementations using Mongoose
│   │   └── (mongo-*.repository.ts files)
│   └── repository.providers.ts  # Factory functions for DI
│
├── shop-items-v2/            # Product management module (v2)
│   ├── dto/                   # Data transfer objects (CreateShopItemV2Dto, etc.)
│   ├── schemas/               # Mongoose schemas (ShopItemV2)
│   ├── shop-items-v2.controller.ts  # REST endpoints
│   ├── shop-items-v2.service.ts      # Business logic
│   ├── shop-items-v2.module.ts      # Module configuration
│   └── *.spec.ts              # Unit tests
│
├── order/                     # Order management module
│   ├── dto/                   # Order DTOs (CreateOrderDto, etc.)
│   ├── schemas/               # Order schemas (OrderUA, OrderWW)
│   ├── order.controller.ts    # Order endpoints
│   ├── order.service.ts       # Order processing logic
│   └── order.module.ts
│
├── auth/                      # Authentication module
│   ├── dto/                   # Auth DTOs (CreateUserDto, LoginUserDto)
│   ├── schemas/               # User schema
│   ├── auth.controller.ts     # Register/login endpoints
│   ├── auth.service.ts        # Auth logic with bcrypt
│   └── auth.module.ts
│
├── promos/                    # Promo code module
│   ├── dto/                   # Promo DTOs
│   ├── schemas/               # PromoItem schema
│   ├── promos.controller.ts
│   ├── promos.service.ts
│   └── promos.module.ts
│
├── certificates/              # Gift certificate module
│   ├── dto/                   # Certificate DTOs
│   ├── schemas/               # Certificate schema
│   ├── certificates.controller.ts
│   ├── certificates.service.ts
│   └── certificates.module.ts
│
├── cloudinary/               # Cloudinary integration module
│   ├── cloudinary.config.ts   # Cloudinary provider setup
│   ├── cloudinary.service.ts  # Upload/delete operations
│   └── cloudinary.module.ts
│
├── media/                    # Media upload handling module
│   ├── media.controller.ts   # File upload endpoints
│   ├── media.service.ts       # Media processing logic
│   └── media.module.ts
│
├── support/                   # Support/contact form module
│   ├── dto/                   # Support request DTO
│   ├── support.controller.ts  # Support endpoint
│   └── support.service.ts
│
└── utils/                    # Utility functions
    ├── sendEmail.ts          # Email sending (Nodemailer)
    └── decodeLiqpayData.ts   # Payment data decoding
```

### Module Responsibilities

- **Shop Items V2**: Product catalog management, inventory, multi-language content
- **Order**: Order lifecycle, payment integration, inventory updates, email notifications
- **Auth**: User registration, login, password management
- **Promos**: Discount code validation and application
- **Certificates**: Gift certificate creation and validation
- **Cloudinary**: Image/video storage and optimization
- **Media**: File upload handling and routing
- **Support**: Customer support request processing

## 🔒 Security & Privacy

This template is designed for **public GitHub release** with security best practices:

- ✅ **No Hardcoded Secrets** - All credentials via environment variables
- ✅ **Password Security** - Bcrypt hashing with salt rounds
- ✅ **Input Validation** - DTO validation on all endpoints
- ✅ **Safe Mock Data** - Generic placeholders (no real customer data)
- ✅ **Environment Isolation** - `.env` file excluded from version control
- ✅ **No Production Data** - All IDs, emails, and URLs are template placeholders
- ✅ **Secure Defaults** - Safe fallback values for missing configuration

### Data Privacy

- All mock data uses generic examples (`PROD-001`, `test@example.com`, etc.)
- No real customer information, orders, or product data
- Safe for public repositories and portfolio sharing

## 🛠️ Development Guide

### How the Repository Pattern Works

The project uses a repository pattern that allows seamless switching between mock and real database implementations:

1. **Interface Definition** - Define the contract in `repositories/interfaces/`
2. **Mock Implementation** - Create in-memory version in `repositories/mocks/`
3. **MongoDB Implementation** - Create database version in `repositories/mongo/`
4. **Module Configuration** - Use factory pattern to inject the correct implementation

**Example: Adding a New Entity**

```typescript
// 1. Define interface
// src/repositories/interfaces/my-entity.repository.interface.ts
export interface IMyEntityRepository {
  findAll(): Promise<MyEntity[]>;
  findById(id: string): Promise<MyEntity | null>;
  create(dto: CreateMyEntityDto): Promise<MyEntity>;
}

// 2. Create mock implementation
// src/repositories/mocks/mock-my-entity.repository.ts
@Injectable()
export class MockMyEntityRepository implements IMyEntityRepository {
  private entities: MyEntity[] = [
    { id: 'ENTITY-001', name: 'Example Entity' },
    // ... more mock data
  ];
  
  async findAll(): Promise<MyEntity[]> {
    return [...this.entities];
  }
  // ... implement other methods
}

// 3. Create MongoDB implementation
// src/repositories/mongo/mongo-my-entity.repository.ts
@Injectable()
export class MongoMyEntityRepository implements IMyEntityRepository {
  constructor(
    @InjectModel(MyEntity.name) private model: Model<MyEntityDocument>
  ) {}
  
  async findAll(): Promise<MyEntity[]> {
    return this.model.find().exec();
  }
  // ... implement other methods
}

// 4. Configure in module
// src/my-entity/my-entity.module.ts
{
  provide: REPOSITORY_TOKENS.MY_ENTITY,
  useFactory: (configService: ConfigService, mongoRepo?: MongoMyEntityRepository) => {
    if (shouldUseMocks(configService) || !mongoRepo) {
      return new MockMyEntityRepository();
    }
    return mongoRepo;
  },
  inject: [ConfigService, MongoMyEntityRepository],
}
```

### Key Development Concepts

**Dependency Injection**: Services depend on repository interfaces, not implementations. This enables:
- Easy testing with mocks
- Database-agnostic business logic
- Runtime switching between data sources

**Module Pattern**: Each feature is a self-contained module with:
- Controller (HTTP endpoints)
- Service (business logic)
- DTOs (data validation)
- Schemas (data models)
- Module (dependency configuration)

**Factory Pattern**: Repository selection happens at runtime based on environment variables, allowing the same codebase to work with or without MongoDB.

## 🏆 Key Engineering Decisions

### Why These Patterns Were Chosen

1. **Repository Pattern**
   - **Problem**: Tight coupling between business logic and data access
   - **Solution**: Abstract data access behind interfaces
   - **Benefit**: Testable, swappable, maintainable code

2. **Dual Repository System (Mock + MongoDB)**
   - **Problem**: Need to develop and test without database dependencies
   - **Solution**: Implement both mock and real repositories with same interface
   - **Benefit**: Zero-config development, fast tests, easy database switching

3. **Dependency Injection**
   - **Problem**: Hard dependencies make code difficult to test and maintain
   - **Solution**: NestJS DI container with interface-based injection
   - **Benefit**: Loose coupling, easy mocking, better testability

4. **Modular Architecture**
   - **Problem**: Monolithic code becomes unmaintainable
   - **Solution**: Feature-based modules with clear boundaries
   - **Benefit**: Scalable, maintainable, team-friendly structure

5. **TypeScript Strict Mode**
   - **Problem**: Runtime errors from type mismatches
   - **Solution**: Strict type checking at compile time
   - **Benefit**: Catch errors early, better IDE support, self-documenting code

## 💡 Use Cases

This project demonstrates:

- **Enterprise Software Development** - Production-ready patterns and practices
- **Backend Architecture** - Scalable, maintainable API design
- **Testing Excellence** - Comprehensive test coverage with best practices
- **Type Safety** - Full TypeScript implementation
- **Clean Code** - SOLID principles and design patterns
- **Developer Experience** - Zero-config, fast development workflow

## 🎯 Engineering Highlights

### Why This Project Stands Out

1. **Enterprise-Grade Architecture**
   - Production-ready patterns, not tutorial code
   - Scalable, maintainable, and extensible design
   - Industry-standard best practices throughout

2. **Zero-Configuration Development**
   - Runs immediately with mock data (no database setup required)
   - Perfect for demonstrations and rapid prototyping
   - Environment-based configuration switching

3. **Comprehensive Test Coverage**
   - 91+ unit tests covering all controllers and services
   - All endpoints tested with happy paths and error cases
   - Tests demonstrate testing best practices with mocked dependencies
   - All tests passing, ready for CI/CD integration

4. **Clean Code Principles**
   - SOLID principles applied consistently
   - DRY (Don't Repeat Yourself) methodology
   - Self-documenting code structure

5. **Type Safety & Developer Experience**
   - Full TypeScript with strict mode enabled
   - Comprehensive type definitions
   - IntelliSense-friendly codebase

6. **Security & Privacy**
   - No hardcoded secrets or credentials
   - Safe for public GitHub repositories
   - Environment variable-based configuration

7. **Extensibility**
   - Easy to add new features following established patterns
   - Clear module boundaries and interfaces
   - Well-documented extension points

## 📊 Technical Metrics

| Metric | Value | Description |
|--------|-------|-------------|
| **Test Coverage** | 91+ tests | All controllers and services tested |
| **Test Suites** | 13 suites | Complete endpoint and service coverage |
| **Feature Modules** | 6 modules | Shop items, orders, auth, promos, certificates, support |
| **Repository Interfaces** | 6 interfaces | Clean data access abstraction layer |
| **Repository Implementations** | 12 total | Mock + MongoDB for each entity |
| **API Endpoints** | 25+ endpoints | RESTful, well-structured routes |
| **TypeScript Coverage** | 100% | All code written in TypeScript with strict mode |
| **Code Quality** | Production-ready | SOLID principles, clean architecture |
| **Dependencies** | Zero runtime | Runs with mock data out of the box |

### Code Quality Indicators

- ✅ **TypeScript Strict Mode** - Full type safety with no `any` types
- ✅ **SOLID Principles** - Applied consistently across all modules
- ✅ **Repository Pattern** - Clean separation of data access logic
- ✅ **Dependency Injection** - Full NestJS DI container usage
- ✅ **Error Handling** - Comprehensive exception handling
- ✅ **Input Validation** - DTO validation on all endpoints
- ✅ **Security** - Password hashing, input sanitization
- ✅ **Documentation** - Well-commented code and comprehensive README

## 📝 License

This project is open source and available for portfolio use, learning, and adaptation.

## 🤝 Contributing

This is a template project. Feel free to:
- Fork and adapt for your needs
- Use as a learning resource
- Submit improvements via pull requests
- Report issues or suggest features

## 📧 Support

For questions, issues, or suggestions, please open a GitHub issue.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd ecommerce-server-template

# Install dependencies
npm install

# Run with mock data (no configuration needed)
npm run start:dev

# Run tests
npm test

# Build for production
npm run build
```

The server will start on `http://localhost:8000` with mock data - no database setup required!

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Repository Pattern Guide](https://martinfowler.com/eaaCatalog/repository.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Built with ❤️ using NestJS**

*This project demonstrates enterprise-grade backend development practices, clean architecture, and production-ready code quality while remaining safe for public GitHub release. Perfect for showcasing software engineering skills to top-tier technology companies.*
