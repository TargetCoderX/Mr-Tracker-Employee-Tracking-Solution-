import Guest from '@/Layouts/GuestLayout';
import axios from 'axios';
import React, { useState } from 'react';
import countryStateCity from '@/jsons/countries+states+cities.json';
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';

function AccountInformation() {
    const [stateAndCity, setstateAndCity] = useState({ states: [], cities: [] });
    const [accountDetailsForm, setaccountDetailsForm] = useState({
        "account_name": "",
        "company_name": "",
        "phone_number": "",
        "country": "",
        "state": "",
        "city": "",
        "address": "",
        "pin_code": "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == "country") {
            setstateAndCity({ states: [], cities: [] });
            const states = countryStateCity.find((element) => { return element.iso3 === value })?.states;
            setstateAndCity({ states: states });
        }
        if (name == "state") {
            const cities = stateAndCity.states.find((element) => { return element.state_code === value })?.cities;
            setstateAndCity({ ...stateAndCity, cities: cities })
        }
        setaccountDetailsForm({ ...accountDetailsForm, [name]: value });
    }
    const submitAccountDetails = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(route("api.save-account-information"), accountDetailsForm);
            if (response.data.status === 1) {
                toast.success(response.data.message);
                router.visit(route('dashboard'));
            }
            else
                toast.error(response.data.message);
        } catch (error) {
            toast.error("Something went wrong, Contact customer care for assistance");
        }
    }

    return (
        <Guest bigCard={true} detailsText="Help us by give more information about you">
            <form onSubmit={(e) => { submitAccountDetails(e) }}>
                <div className="row">
                    <div className="form-group col-md-4">
                        <label htmlFor="">Account Name <strong className='text-danger'>*</strong></label>
                        <input type="text" value={accountDetailsForm.account_name} onChange={(e) => handleChange(e)} name='account_name' placeholder='Account Name' className="form-control" required />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="">Company Name (If not applicable, Place N/A) <strong className='text-danger'>*</strong></label>
                        <input type="text" value={accountDetailsForm.company_name} onChange={(e) => handleChange(e)} name='company_name' placeholder='Company Name' className="form-control" required />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="">Phone Number <strong className='text-danger'>*</strong></label>
                        <input type="number" value={accountDetailsForm.phone_number} onChange={(e) => handleChange(e)} name='phone_number' placeholder='1234-***-***' className="form-control" required />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="">Country <strong className='text-danger'>*</strong></label>
                        <select name="country" value={accountDetailsForm.country} onChange={(e) => handleChange(e)} id="country" className="form-control text-dark" required>
                            <option value="" style={{ display: "none" }}>Select Country</option>
                            {countryStateCity && countryStateCity.map((countries) => (
                                <option value={countries.iso3} key={countries.iso3}>{countries.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="">State <strong className='text-danger'>*</strong></label>
                        <select name="state" value={accountDetailsForm.state} onChange={(e) => handleChange(e)} id="state" className="form-control text-dark" required>
                            <option value="" style={{ display: "none" }}>Select State</option>
                            {stateAndCity.states && stateAndCity.states.map((state) => (
                                <option value={state.state_code} key={state.state_code}>{state.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="">City <strong className='text-danger'>*</strong></label>
                        <select name="city" value={accountDetailsForm.city} onChange={(e) => handleChange(e)} id="city" className="form-control text-dark" required>
                            <option value="" style={{ display: "none" }}>Select City</option>
                            {stateAndCity.cities && stateAndCity.cities.map((city) => (
                                <option value={city.name} key={city.name}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="">Address <strong className='text-danger'>*</strong></label>
                        <input type="text" value={accountDetailsForm.address} onChange={(e) => handleChange(e)} name='address' placeholder='Address' className="form-control" required />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="">PIN Code <strong className='text-danger'>*</strong></label>
                        <input type="number" value={accountDetailsForm.pin_code} onChange={(e) => handleChange(e)} name='pin_code' placeholder='Pin Code' className="form-control" required />
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary">Save Information</button>
                    </div>
                </div>
            </form>
        </Guest>
    );
}

export default AccountInformation;

