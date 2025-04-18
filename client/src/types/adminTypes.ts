export interface Admin {
  _id: string;
  email: string;
  role: "admin";
  createdAt: string; // Changed from hardcoded date to string type
  updatedAt: string; // Changed from hardcoded date to string type
}
