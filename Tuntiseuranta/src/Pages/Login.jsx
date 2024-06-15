import {GoogleButton} from 'react-google-button'


const Login = () => {

    return (
        <body className='LoginPage'>
          <div className="LogWindow">
          <h1>SPOT<a className='it'>it</a></h1>
          <div className='LogText'>  
          <GoogleButton />
            <h2>Mikä on SPOT<a className='it'>it</a> sovellus?</h2>
            <p>SPOT<a className='it'>it</a> on selainpohjainen ilmainen applikaatio, joka auttaa hauskassa rekisterikilpibongaus-harrastuksessa!</p>
            <p>Tarkoituksena on bongailla reksiterikilpiä järjestyksessä numerosta 1 numeroon 999 asti. Kirjaudu sisään Google-tunnuksillasi ja olet valmiina aloittamaan bongailun.</p> 
            <p>Voit aloittaa pelin löytämällä rekisterikilven numero 1. Jos olet jo aloittanut pelin, voit jatkaa merkkaamalla seuraavan bongaamasi rekisterikilven</p>
            <p>Kartta-osiosta voit merkata sijainnin, jossa bongasit rekisterikilven. Bongautut numerot tallentuu omalle välilehdelleen.</p>
          </div>
          </div>
        </body>
    )
}

export default Login;