import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Feed } from "./components/Feed";
import { LoginForm } from "./components/LoginForm";
import { PostEditor } from "./components/PostEditor";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <nav className="mx-auto max-w-4xl px-4 py-4 flex gap-4">
            <Link to="/">Feed</Link>
            <Link to="/login">Log In</Link>
            <Link to="/write">Write</Link>
          </nav>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-6">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/write" element={<PostEditor />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}