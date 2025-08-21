export const createBook = (data) => ({
  id: data.id || Date.now().toString(),
  title: data.title,
  author: data.author,
  description: data.description,
  genre: data.genre,
  rating: data.rating || 0,
  coverImage: data.coverImage || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
  pdfData: data.pdfData, // Base64 encoded PDF data
  fileName: data.fileName,
  fileSize: data.fileSize,
  currentPage: data.currentPage || 1,
  totalPages: data.totalPages || 0,
  dateAdded: data.dateAdded || new Date().toISOString(),
  lastRead: data.lastRead || null,
  isCompleted: data.isCompleted || false,
});