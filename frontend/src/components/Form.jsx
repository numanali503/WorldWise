// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';

import styles from './Form.module.css';
import Button from './Button';
import BackButton from './BackButton';
import Spinner from '../components/Spinner';
import Message from '../components/Message';
import 'react-datepicker/dist/react-datepicker.css';

import { useUrlPosition } from '../hooks/useUrlPosition';
import DatePicker from 'react-datepicker';
import { useCities } from '../contexts/CitiesContext';
import { useNavigate } from 'react-router-dom';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
function Form() {
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [isLoadingGeoLocation, setIsLoadingGeoLocation] = useState(false);
  const [geoLocationError, setGeoLocationError] = useState('');
  const [emoji, setEmoji] = useState('');

  useEffect(
    function () {
      if (!lat && !lng) return;

      async function fetchCitiesData() {
        try {
          setIsLoadingGeoLocation(true);
          setGeoLocationError('');
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "That doesn't to be a country try somewhere else 😉"
            );
          setCityName(data.city);
          setCountry(data.countryName || data.locality || '');
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setGeoLocationError(err.message);
        } finally {
          setIsLoadingGeoLocation(false);
        }
      }
      fetchCitiesData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await createCity(newCity);
    navigate('/app/cities');
  }

  if (isLoadingGeoLocation) return <Spinner />;
  if (!lat && !lng) return <Message message="Start by clicking on the map" />;
  if (geoLocationError) return <Message message={geoLocationError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
