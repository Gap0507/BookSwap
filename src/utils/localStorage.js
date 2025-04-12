
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return defaultValue;
  }
};

// Initialize sample data if none exists
export const initializeLocalStorage = () => {
  // Sample users
  if (!localStorage.getItem('users')) {
    const sampleUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'owner@example.com',
        password: 'password123',
        mobile: '123-456-7890',
        role: 'owner'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'seeker@example.com',
        password: 'password123',
        mobile: '987-654-3210',
        role: 'seeker'
      }
    ];
    saveToLocalStorage('users', sampleUsers);
  }

  // Sample books
  if (!localStorage.getItem('books')) {
    const sampleBooks = [
      {
        id: '1',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        location: 'New York',
        ownerId: '1',
        status: 'available',
        description: 'A classic of modern American literature, dealing with serious issues of rape and racial inequality.',
        cover: 'https://source.unsplash.com/random/400x600/?book,mockingbird'
      },
      {
        id: '2',
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        location: 'San Francisco',
        ownerId: '1',
        status: 'available',
        description: 'A dystopian novel published in 1949, set in a society with omnipresent government surveillance.',
        cover: 'https://source.unsplash.com/random/400x600/?book,dystopia'
      },
      {
        id: '3',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Classic',
        location: 'Chicago',
        ownerId: '1',
        status: 'rented',
        description: 'A novel that examines themes of decadence, idealism, resistance to change, social upheaval, and excess.',
        cover: 'https://source.unsplash.com/random/400x600/?book,gatsby'
      },
      {
        id: '4',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        location: 'Boston',
        ownerId: '1',
        status: 'available',
        description: 'A fantasy novel set in Middle-earth, following the quest of Bilbo Baggins to win a share of a treasure guarded by a dragon.',
        cover: 'https://source.unsplash.com/random/400x600/?book,fantasy'
      },
      {
        id: '5',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        location: 'London',
        ownerId: '1',
        status: 'available',
        description: 'A romantic novel following the character development of Elizabeth Bennet.',
        cover: 'https://source.unsplash.com/random/400x600/?book,romance'
      },
      {
        id: '6',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        genre: 'Fiction',
        location: 'New York',
        ownerId: '1',
        status: 'available',
        description: 'A novel that explores themes of adolescent alienation and identity.',
        cover: 'https://source.unsplash.com/random/400x600/?book,vintage'
      }
    ];
    saveToLocalStorage('books', sampleBooks);
  }
};
