import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";

// --- MAIN COMPONENT ---
export default function App() {
  const { state, signIn, signOut, getDecodedIDToken } = useAuthContext();
  const [showAdmin, setShowAdmin] = useState(false);

  const [userInfo, setUserInfo] = useState({
    studentId: "Loading...",
    photoUrl: null,
    involvement: "Loading...",
    validThru: "Loading...",
    isAdmin: false,
  });

  useEffect(() => {
    if (state.isAuthenticated) {
      getDecodedIDToken()
        .then((payload) => {
          const userRoles = payload.roles || [];

          const hasAdminRole = userRoles.includes("UniversityAdmin");

          setUserInfo({
            studentId: payload.student_id || "N/A",
            photoUrl: payload.picture || null,
            involvement: payload.involvement || "Student",
            validThru: payload.valid_thru || "N/A",
            isAdmin: hasAdminRole,
          });
        })
        .catch((error) => {
          console.error("Failed to decode token:", error);
        });
    }
  }, [state.isAuthenticated, getDecodedIDToken]);

  // --- LOADING SCREEN ---
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          Verifying Digital ID...
        </p>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl text-center max-w-sm w-full">
          <div className="mb-6 mx-auto bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
            🎓
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Student Portal
          </h1>
          <p className="text-blue-200 mb-8 text-sm">
            Secure Digital Identity System
          </p>
          <button
            onClick={() => signIn()}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/30 transform hover:scale-[1.02]"
          >
            Access ID Card
          </button>
        </div>
      </div>
    );
  }

  // --- ADMIN PORTAL VIEW ---
  if (showAdmin) {
    return <AdminPortal onBack={() => setShowAdmin(false)} />;
  }

  // --- DIGITAL ID CARD VIEW ---
  const avatarSource =
    userInfo.photoUrl ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${state.displayName}&backgroundColor=0369a1&textColor=ffffff`;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden relative">
        {/* CARD HEADER */}
        <div className="h-40 bg-linear-to-r from-blue-700 to-indigo-800 relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white opacity-5 rounded-full"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-6 left-0 w-full text-center z-10">
            <p className="text-blue-200 text-xs font-bold tracking-[0.2em] uppercase">
              University of Technology
            </p>
            <h1 className="text-white text-2xl font-bold mt-1">
              {userInfo.isAdmin ? "ADMINISTRATOR ID" : "STUDENT ID"}
            </h1>
          </div>
        </div>

        {/* PHOTO */}
        <div className="relative -mt-16 flex justify-center z-20">
          <div className="p-1.5 bg-white rounded-full shadow-lg">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 bg-gray-200">
              <img
                src={avatarSource}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div
            className="absolute bottom-2 right-[30%] bg-green-500 text-white p-1.5 rounded-full border-4 border-white shadow-md"
            title="Identity Verified"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* DETAILS */}
        <div className="text-center mt-3 mb-6 px-6">
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            {state.displayName}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{state.email}</p>
          <div className="mt-3 inline-block px-4 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
            Active User
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 grid grid-cols-2 gap-4">
            <div className="text-left">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {userInfo.isAdmin ? "Administrator ID" : "Student ID"}
              </p>
              <p className="text-lg font-mono font-bold text-blue-900 mt-0.5">
                {userInfo.studentId}
              </p>
            </div>
            <div className="text-left border-l border-gray-200 pl-4">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Valid Thru
              </p>
              <p className="text-lg font-mono font-bold text-gray-800 mt-0.5">
                {userInfo.validThru}
              </p>
            </div>
            <div className="text-left col-span-2 border-t border-gray-200 pt-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Involvement
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {userInfo.involvement}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 flex flex-col gap-3">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-red-600 font-medium text-sm transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Secure Sign Out
          </button>

          {userInfo.isAdmin && (
            <button
              onClick={() => setShowAdmin(true)}
              className="text-xs text-blue-400 hover:text-blue-600 underline text-center"
            >
              University Admin Portal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SECURE INVITATION ADMIN PORTAL (USING FETCH) ---
function AdminPortal({ onBack }) {
  const { getAccessToken } = useAuthContext();

  const [tab, setTab] = useState("invite");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ADD USER STATE
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    studentId: "",
    involvement: "Undergraduate",
    validThru: "",
  });
  const [addMessage, setAddMessage] = useState("");
  const [adding, setAdding] = useState(false);

  // COMMON INPUT HANDLER
  const updateForm = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = await getAccessToken();

      const response = await fetch(
        "https://api.asgardeo.io/t/idcardapp/api/asgardeo-guest/v1/users/invite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.status === 201) {
        setMessage(`✅ Success! Invitation sent to ${email}.`);
        setEmail("");
      } else {
        const text = await response.text();
        setMessage(
          `❌ Error: ${text || `Request failed with status ${response.status}`}`
        );
      }
    } catch (error) {
      console.error("Invitation Fetch Error:", error);
      setMessage(
        `❌ Network or CORS Error: The request succeeded, but the response couldn't be read.`
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // ADD USER MANUALLY USING SCIM2
  // --------------------------------
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAdding(true);
    setAddMessage("");

    try {
      const generatedPassword =
        form.involvement === "Undergraduate"
          ? `UStu${form.studentId}`
          : `PStu${form.studentId}`;

      const scimPayload = {
        schemas: [
          "urn:ietf:params:scim:schemas:core:2.0:User",
          "urn:scim:wso2:schema",
        ],
        userName: form.email,
        password: generatedPassword,
        name: {
          givenName: form.firstName,
          familyName: form.lastName,
        },
        emails: [
          {
            primary: true,
            value: form.email,
            type: "home",
          },
        ],
        "urn:scim:wso2:schema": {
          // no userStoreDomain -> will use PRIMARY store
          "http://wso2.org/claims/student_id": form.studentId,
          "http://wso2.org/claims/involvement": form.involvement,
          "http://wso2.org/claims/valid_thru": form.validThru,
        },
        roles: [{ value: "Student" }],
      };

      const response = await fetch("http://localhost:4000/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scimPayload),
      });

      let data = {};
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (response.status === 201) {
        setAddMessage(
          `✅ User created! Temporary password: ${generatedPassword}`
        );
        setForm({
          email: "",
          firstName: "",
          lastName: "",
          studentId: "",
          involvement: "Undergraduate",
          validThru: "",
        });
      } else {
        setAddMessage(`❌ Error: ${data.detail || JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error("Add user error:", err);
      setAddMessage("❌ Network or Server Error.");
    } finally {
      setAdding(false);
    }
  };

  // --------------------------------------------------
  //                ADMIN PORTAL UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
        <button
          onClick={onBack}
          className="text-sm text-blue-500 hover:underline mb-6 flex items-center gap-1"
        >
          ← Back to ID Card
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          University Admin Portal
        </h2>

        {/* TAB SWITCHER */}
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 ${
              tab === "invite"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setTab("invite")}
          >
            Send Invite
          </button>
          <button
            className={`flex-1 py-2 ${
              tab === "add"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setTab("add")}
          >
            Add User Manually
          </button>
        </div>

        {/* ----------------------------- */}
        {/* TAB 1: SEND INVITATION        */}
        {/* ----------------------------- */}
        {tab === "invite" && (
          <form onSubmit={handleInvite}>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Student Email
            </label>
            <input
              type="email"
              className="w-full mb-4 p-2 border rounded"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md"
            >
              {loading ? "Sending..." : "Send Invitation"}
            </button>

            {message && (
              <p className="mt-4 p-3 text-sm rounded bg-gray-50">{message}</p>
            )}
          </form>
        )}

        {/* ----------------------------- */}
        {/* TAB 2: ADD USER MANUALLY      */}
        {/* ----------------------------- */}
        {tab === "add" && (
          <form onSubmit={handleAddUser}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                className="border p-2 rounded"
                placeholder="First Name"
                required
                value={form.firstName}
                onChange={(e) => updateForm("firstName", e.target.value)}
              />

              <input
                className="border p-2 rounded"
                placeholder="Last Name"
                required
                value={form.lastName}
                onChange={(e) => updateForm("lastName", e.target.value)}
              />
            </div>

            <input
              className="w-full border p-2 rounded mb-4"
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
            />

            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="Student ID"
              required
              value={form.studentId}
              onChange={(e) => updateForm("studentId", e.target.value)}
            />

            <select
              className="w-full border p-2 rounded mb-4"
              value={form.involvement}
              onChange={(e) => updateForm("involvement", e.target.value)}
            >
              <option>Undergraduate</option>
              <option>Postgraduate</option>
            </select>

            <input
              className="w-full border p-2 rounded mb-4"
              type="date"
              required
              value={form.validThru}
              onChange={(e) => updateForm("validThru", e.target.value)}
            />

            <button
              type="submit"
              disabled={adding}
              className="w-full bg-green-600 text-white py-2 rounded-md"
            >
              {adding ? "Creating..." : "Create Student User"}
            </button>

            {addMessage && (
              <p className="mt-4 p-3 text-sm rounded bg-gray-50">
                {addMessage}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
