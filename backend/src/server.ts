import app from './app';
import { connectDatabase, sequelize } from './config/database';
import { initializeElasticsearch } from './config/elasticsearch';
import './models'; // Import models to initialize associations

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Sync database models (create tables if they don't exist)
    // Use { alter: true } in development to update tables, { force: true } to drop and recreate
    if (process.env.DB_SYNC === 'true') {
      console.log('🔄 Syncing database models...');
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synced successfully');
    }

    // Initialize Elasticsearch (non-blocking)
    initializeElasticsearch().catch((error) => {
      console.warn('⚠️  Elasticsearch initialization failed:', error.message);
    });

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}`);
      console.log(`💚 Health: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();
