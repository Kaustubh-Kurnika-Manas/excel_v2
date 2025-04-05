import React, { useState } from 'react';

const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    middlename: "",
    lastname: "",
    phone_no: "",
    gender: "",
    blood_group: "",
    home_place: "",
    address: "",
    guardian_name: "",
    guardian_ph_no: "",
    guardian_address: "",
    family_details: "",
    hobbies: "",
    enrollmentNumber: "",
    year: "",
    department: "",
    programme: "",
    enrollment_year: "",
    hostel_name: "",
    hostel_room_no: "",
    warden_name: "",
    warden_ph_no: "",
    asst_warden_name: "",
    asst_warden_ph_no: "",
    responsible_contact_person_at_residence: "",
    contact_no_of_contact_person: "",
    residence_address: "",
});

{/* Year Selection */}
<div className="mb-3">
    <label htmlFor="year" className="form-label">
        Year <span className="text-danger">*</span>
    </label>
    <select
        className="form-select"
        id="year"
        name="year"
        value={formData.year}
        onChange={handleChange}
        required
    >
        <option value="">Select Year</option>
        <option value="I">First Year</option>
        <option value="II">Second Year</option>
        <option value="III">Third Year</option>
        <option value="IV">Fourth Year</option>
    </select>
</div> 