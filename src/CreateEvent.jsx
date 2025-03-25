
import { useState, useEffect } from "react";
import { Calendar, X, Plus, Upload, Loader2 } from "lucide-react";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: '',
    smallDescription: '',
    detailedDescription: '',
    registrationFee: '',
    location: '',
    dateTime: '',
    picture: '',
    organizers: [], // Changed to array of objects {id, name}
    chiefGuests: []
  });
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [newChiefGuest, setNewChiefGuest] = useState({ name: '', picture: '' });
  const [uploading, setUploading] = useState(false);
  const [organizerSearchQuery, setOrganizerSearchQuery] = useState('');
  const [organizerSearchResults, setOrganizerSearchResults] = useState([]);

  // Function to check if the query is a roll number
  const isRollNo = (query) => {
    const rollNoRegex = /^\d{6}98-\d{3}$/;
    return rollNoRegex.test(query);
  };

  // Fetch organizers based on search query with debounce
  const fetchOrganizerSearchResults = async (query) => {
    if (!query.trim()) {
      setOrganizerSearchResults([]);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      let url;
      if (isRollNo(query)) {
        url = `http://localhost:3000/user/search?rollNo=${query}&limit=10`;
      } else {
        url = `http://localhost:3000/user/search?rollNo=${query}&name=${query}&limit=10`;
      }
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setOrganizerSearchResults(data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
      setOrganizerSearchResults([]);
    }
  };

  // Debounce the search API call
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrganizerSearchResults(organizerSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [organizerSearchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmCreate = async () => {
    setShowModal(false);
    try {
      const response = await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          registrationFee: Number(formData.registrationFee),
          organizers: formData.organizers.map(org => org.id), // Send only IDs
          chiefGuests: formData.chiefGuests.filter(g => g.name && g.picture)
        })
      });

      if (!response.ok) throw new Error('Failed to create event');
      
      setNotification({ type: 'success', message: 'Event created successfully!' });
      setFormData({
        name: '',
        smallDescription: '',
        detailedDescription: '',
        registrationFee: '',
        location: '',
        dateTime: '',
        picture: '',
        organizers: [],
        chiefGuests: []
      });
      setOrganizerSearchQuery('');
      setOrganizerSearchResults([]);
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
    }
  };

  // Generalized file upload handler
  const handleFileUpload = async (file, onSuccess) => {
    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('files', file);
      const response = await fetch('http://51.20.78.40:3000/upload', {
        method: 'POST',
        body: uploadData,
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      onSuccess(data.url);
    } catch (error) {
      setNotification({ type: 'error', message: 'Image upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const addChiefGuest = () => {
    if (newChiefGuest.name.trim() && newChiefGuest.picture.trim()) {
      setFormData(prev => ({
        ...prev,
        chiefGuests: [...prev.chiefGuests, { ...newChiefGuest }]
      }));
      setNewChiefGuest({ name: '', picture: '' });
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8 mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Event</h1>

      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } animate-slide-in`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Event Image Upload Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Event Image
          </label>
          <div className="flex items-center justify-center">
            {formData.picture ? (
              <div className="relative group">
                <img
                  src={formData.picture}
                  alt="Event preview"
                  className="w-48 h-48 rounded-lg object-cover border-2 border-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, picture: '' }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                    <span className="text-gray-500 text-sm">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-500">Click to upload image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleFileUpload(file, (url) => setFormData(prev => ({ ...prev, picture: url })));
                    }
                  }}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Fee (Rs) *</label>
              <input
                type="number"
                value={formData.registrationFee}
                onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
              <textarea
                value={formData.smallDescription}
                onChange={(e) => setFormData({ ...formData, smallDescription: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 h-32"
                maxLength={150}
              />
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
          <textarea
            value={formData.detailedDescription}
            onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 h-48"
          />
        </div>

        {/* Organizers Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Organizers</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.organizers.map((org, index) => (
              <span key={org.id} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {org.name}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    organizers: prev.organizers.filter((_, i) => i !== index)
                  }))}
                  className="hover:text-indigo-900"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <input
              value={organizerSearchQuery}
              onChange={(e) => setOrganizerSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm"
              placeholder="Search for organizers"
            />
            {organizerSearchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {organizerSearchResults.map((user) => (
                  <div
                    key={user._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      if (!formData.organizers.some(o => o.id === user._id)) {
                        setFormData(prev => ({
                          ...prev,
                          organizers: [...prev.organizers, {
                            id: user._id,
                            name: `${user.firstName} ${user.lastName} (${user.rollNo})`
                          }]
                        }));
                      }
                      setOrganizerSearchQuery('');
                      setOrganizerSearchResults([]);
                    }}
                  >
                    {`${user.firstName} ${user.lastName} (${user.rollNo})`}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chief Guests Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Chief Guests</label>
          <div className="space-y-3">
            {formData.chiefGuests.map((guest, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-sm flex-1">{guest.name}</span>
                {guest.picture && (
                  <img src={guest.picture} alt={guest.name} className="w-10 h-10 rounded-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    chiefGuests: prev.chiefGuests.filter((_, i) => i !== index)
                  }))}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                value={newChiefGuest.name}
                onChange={(e) => setNewChiefGuest(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Guest name"
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm"
              />
              <div className="relative">
                {newChiefGuest.picture ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={newChiefGuest.picture}
                      alt="Preview"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setNewChiefGuest(prev => ({ ...prev, picture: '' }))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-full h-10 cursor-pointer border border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors text-sm">
                    {uploading ? (
                      <Loader2 className="animate-spin text-indigo-500" size={16} />
                    ) : (
                      'Upload picture'
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleFileUpload(file, (url) => setNewChiefGuest(prev => ({ ...prev, picture: url })));
                        }
                      }}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
              <button
                type="button"
                onClick={addChiefGuest}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Guest
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Create Event
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Event Creation</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to create this event?</p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCreate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;


// import { useState, useEffect } from "react";
// import { Calendar, X, Plus, Upload, Loader2 } from "lucide-react";

// const CreateEvent = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     smallDescription: '',
//     detailedDescription: '',
//     registrationFee: '',
//     location: '',
//     dateTime: '',
//     picture: '',
//     organizers: [], // Array of objects {id, name}
//     chiefGuests: []
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [notification, setNotification] = useState(null);
//   const [newChiefGuest, setNewChiefGuest] = useState({ name: '', picture: '' });
//   const [uploading, setUploading] = useState(false);
//   const [organizerSearchQuery, setOrganizerSearchQuery] = useState('');
//   const [organizerSearchResults, setOrganizerSearchResults] = useState([]);

//   // Function to check if the query is a roll number
//   const isRollNo = (query) => {
//     const rollNoRegex = /^\d{6}98-\d{3}$/;
//     return rollNoRegex.test(query);
//   };

//   // Fetch organizers based on search query with debounce
//   const fetchOrganizerSearchResults = async (query) => {
//     if (!query.trim()) {
//       setOrganizerSearchResults([]);
//       return;
//     }
//     try {
//       const token = localStorage.getItem('token');
//       let url = isRollNo(query)
//         ? `http://localhost:3000/user/search?rollNo=${query}&limit=10`
//         : `http://localhost:3000/user/search?rollNo=${query}&name=${query}&limit=10`;
//       const response = await fetch(url, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (!response.ok) throw new Error('Search failed');
//       const data = await response.json();
//       setOrganizerSearchResults(data.users || []);
//     } catch (error) {
//       console.error('Error searching users:', error);
//       setOrganizerSearchResults([]);
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => fetchOrganizerSearchResults(organizerSearchQuery), 300);
//     return () => clearTimeout(timer);
//   }, [organizerSearchQuery]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setShowModal(true);
//   };

//   const confirmCreate = async () => {
//     setShowModal(false);
//     try {
//       const response = await fetch('http://localhost:3000/events', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({
//           ...formData,
//           registrationFee: Number(formData.registrationFee),
//           organizers: formData.organizers.map(org => org.id),
//           chiefGuests: formData.chiefGuests.filter(g => g.name && g.picture)
//         })
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to create event');
//       }
//       setNotification({ type: 'success', message: 'Event created successfully!' });
//       setFormData({
//         name: '',
//         smallDescription: '',
//         detailedDescription: '',
//         registrationFee: '',
//         location: '',
//         dateTime: '',
//         picture: '',
//         organizers: [],
//         chiefGuests: []
//       });
//       setOrganizerSearchQuery('');
//       setOrganizerSearchResults([]);
//     } catch (error) {
//       setNotification({ type: 'error', message: error.message });
//     }
//   };

//   const handleFileUpload = async (file, onSuccess) => {
//     setUploading(true);
//     try {
//       const uploadData = new FormData();
//       uploadData.append('files', file);
//       const response = await fetch('http://51.20.78.40:3000/upload', {
//         method: 'POST',
//         body: uploadData,
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Upload failed: ${errorText}`);
//       }
//       const data = await response.json();
//       console.log('Upload successful, URL:', data.url); // Debug log
//       if (!data.url) throw new Error('No URL returned from upload');
//       onSuccess(data.url);
//     } catch (error) {
//       console.error('Upload error:', error);
//       setNotification({ type: 'error', message: error.message });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const addChiefGuest = () => {
//     console.log('Attempting to add chief guest:', newChiefGuest); // Debug log
//     if (!newChiefGuest.name.trim() || !newChiefGuest.picture.trim()) {
//       setNotification({ type: 'error', message: 'Please provide both name and picture for the chief guest' });
//       return;
//     }
//     setFormData(prev => ({
//       ...prev,
//       chiefGuests: [...prev.chiefGuests, { ...newChiefGuest }]
//     }));
//     setNewChiefGuest({ name: '', picture: '' });
//     console.log('Chief guest added:', newChiefGuest); // Debug log
//   };

//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => setNotification(null), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   return (
//     <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8 mb-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Event</h1>

//       {notification && (
//         <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
//           notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
//         } animate-slide-in`}>
//           {notification.message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-8">
//         {/* Event Image Upload Section */}
//         <div className="space-y-4">
//           <label className="block text-sm font-medium text-gray-700">Event Image</label>
//           <div className="flex items-center justify-center">
//             {formData.picture ? (
//               <div className="relative group">
//                 <img
//                   src={formData.picture}
//                   alt="Event preview"
//                   className="w-48 h-48 rounded-lg object-cover border-2 border-indigo-100"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setFormData(prev => ({ ...prev, picture: '' }))}
//                   className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             ) : (
//               <label className="flex flex-col items-center justify-center w-full h-48 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors">
//                 {uploading ? (
//                   <div className="flex flex-col items-center">
//                     <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
//                     <span className="text-gray-500 text-sm">Uploading...</span>
//                   </div>
//                 ) : (
//                   <>
//                     <Upload className="text-gray-400 mb-2" size={32} />
//                     <p className="text-sm text-gray-500">Click to upload image</p>
//                     <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
//                   </>
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                       handleFileUpload(file, (url) => setFormData(prev => ({ ...prev, picture: url })));
//                     }
//                   }}
//                   disabled={uploading}
//                 />
//               </label>
//             )}
//           </div>
//         </div>

//         {/* Form Fields */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
//               <input
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 required
//                 className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Registration Fee (₹) *</label>
//               <input
//                 type="number"
//                 value={formData.registrationFee}
//                 onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
//                 required
//                 className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
//               <input
//                 value={formData.location}
//                 onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                 required
//                 className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
//               <div className="relative">
//                 <input
//                   type="datetime-local"
//                   value={formData.dateTime}
//                   onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
//                   required
//                   className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
//               <textarea
//                 value={formData.smallDescription}
//                 onChange={(e) => setFormData({ ...formData, smallDescription: e.target.value })}
//                 required
//                 className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 h-32"
//                 maxLength={150}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Detailed Description */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
//           <textarea
//             value={formData.detailedDescription}
//             onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
//             required
//             className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 h-48"
//           />
//         </div>

//         {/* Organizers Section */}
//         <div className="space-y-4">
//           <label className="block text-sm font-medium text-gray-700">Organizers</label>
//           <div className="flex flex-wrap gap-2 mb-2">
//             {formData.organizers.map((org, index) => (
//               <span key={org.id} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
//                 {org.name}
//                 <button
//                   type="button"
//                   onClick={() => setFormData(prev => ({
//                     ...prev,
//                     organizers: prev.organizers.filter((_, i) => i !== index)
//                   }))}
//                   className="hover:text-indigo-900"
//                 >
//                   <X size={14} />
//                 </button>
//               </span>
//             ))}
//           </div>
//           <div className="relative">
//             <input
//               value={organizerSearchQuery}
//               onChange={(e) => setOrganizerSearchQuery(e.target.value)}
//               className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm"
//               placeholder="Search for organizers"
//             />
//             {organizerSearchResults.length > 0 && (
//               <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                 {organizerSearchResults.map((user) => (
//                   <div
//                     key={user._id}
//                     className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//                     onClick={() => {
//                       if (!formData.organizers.some(o => o.id === user._id)) {
//                         setFormData(prev => ({
//                           ...prev,
//                           organizers: [...prev.organizers, {
//                             id: user._id,
//                             name: `${user.firstName} ${user.lastName} (${user.rollNo})`
//                           }]
//                         }));
//                       }
//                       setOrganizerSearchQuery('');
//                       setOrganizerSearchResults([]);
//                     }}
//                   >
//                     {`${user.firstName} ${user.lastName} (${user.rollNo})`}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Chief Guests Section */}
//         <div className="space-y-4">
//           <label className="block text-sm font-medium text-gray-700">Chief Guests</label>
//           <div className="space-y-3">
//             {formData.chiefGuests.map((guest, index) => (
//               <div key={index} className="flex items-center gap-4">
//                 <span className="text-sm flex-1">{guest.name}</span>
//                 {guest.picture && (
//                   <img src={guest.picture} alt={guest.name} className="w-10 h-10 rounded-full object-cover" />
//                 )}
//                 <button
//                   type="button"
//                   onClick={() => setFormData(prev => ({
//                     ...prev,
//                     chiefGuests: prev.chiefGuests.filter((_, i) => i !== index)
//                   }))}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             ))}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//               <input
//                 value={newChiefGuest.name}
//                 onChange={(e) => setNewChiefGuest(prev => ({ ...prev, name: e.target.value }))}
//                 placeholder="Guest name"
//                 className="px-4 py-2 rounded-lg border border-gray-300 text-sm"
//               />
//               <div className="relative">
//                 {newChiefGuest.picture ? (
//                   <div className="flex items-center gap-2">
//                     <img
//                       src={newChiefGuest.picture}
//                       alt="Preview"
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setNewChiefGuest(prev => ({ ...prev, picture: '' }))}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 ) : (
//                   <label className="flex items-center justify-center w-full h-10 cursor-pointer border border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors text-sm">
//                     {uploading ? (
//                       <Loader2 className="animate-spin text-indigo-500" size={16} />
//                     ) : (
//                       'Upload picture'
//                     )}
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) => {
//                         const file = e.target.files[0];
//                         if (file) {
//                           handleFileUpload(file, (url) => setNewChiefGuest(prev => ({ ...prev, picture: url })));
//                         }
//                       }}
//                       disabled={uploading}
//                     />
//                   </label>
//                 )}
//               </div>
//               <button
//                 type="button"
//                 onClick={addChiefGuest}
//                 className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm flex items-center justify-center gap-2"
//               >
//                 <Plus size={16} /> Add Guest
//               </button>
//             </div>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
//         >
//           Create Event
//         </button>
//       </form>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full">
//             <h3 className="text-xl font-semibold mb-4">Confirm Event Creation</h3>
//             <p className="text-gray-600 mb-6">Are you sure you want to create this event?</p>
//             <div className="flex justify-end gap-4">
//               <button
//                 type="button"
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={confirmCreate}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateEvent;




