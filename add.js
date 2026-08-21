const form = document.getElementById( 'form-new-employee' );

document.addEventListener( 'DOMContentLoaded', () => {

    let select = form.querySelector( '[name="department"]' );
    select.innerHTML = '<option value=""></option>';

    departments.forEach( e => {

        const option = document.createElement( 'option' );
        option.value = option.innerText = e;
        select.appendChild( option );

    } );

    select = form.querySelector( '[name="designation"]' );
    select.innerHTML = '<option value=""></option>';

    designations.forEach( e => {

        const option = document.createElement( 'option' );
        option.value = option.innerText = e;
        select.appendChild( option );

    } );

    select = form.querySelector( '[name="country"]' );
    select.innerHTML = '<option value=""></option>';

    Object.keys( CSC ).map( opt => {

        const option = document.createElement( 'option' );
        option.value = option.innerText = opt;
        select.appendChild( option );

    } );

} );

form.querySelector( '[name="country"]' ).addEventListener( 'change', e => {

    const value = e.target.value;
    if ( value === '' ) {

        form.querySelectorAll( '[name="state"], [name="city"]' ).forEach( elt => {

            elt.value = elt.innerHTML = '';
            elt.setAttribute( 'disabled', true );
            elt.classList.add( 'cursor-not-allowed' );

        } );
        return;

    }

    const state = form.querySelector( '[name="state"]' );
    state.innerHTML = '<option value=""></option>';

    Object.keys( CSC[ value ] ).map( opt => {

        const option = document.createElement( 'option' );
        option.value = option.innerText = opt;
        state.appendChild( option );

    } );

    state.classList.remove( 'cursor-not-allowed' );
    state.removeAttribute( 'disabled' )

} );

form.querySelector( '[name="state"]' ).addEventListener( 'change', e => {

    const country = form.querySelector( '[name="country"]' ).value;
    const value = e.target.value;
    const city = form.querySelector( '[name="city"]' );

    if ( value === '' ) {
        
        city.value = city.innerHTML = '';
        city.setAttribute( 'disabled', true );
        city.classList.add( 'cursor-not-allowed' );

        return;

    }

    city.innerHTML = '<option value=""></option>';

    CSC[ country ][ value ].map( opt => {

        const option = document.createElement( 'option' );
        option.value = option.innerText = opt;
        city.appendChild( option );

    } );

    city.classList.remove( 'cursor-not-allowed' );
    city.removeAttribute( 'disabled' )

} );

document.getElementById( 'btn-back' ).addEventListener( 'click', () => { window.location.href = '/'; } );

form.addEventListener( 'submit', async e => {

    e.preventDefault();

    e.target.children.namedItem( 'formError' )?.remove();

    const data = {};

    try {

        new FormData( e.target ).forEach( ( value, key ) => { data[ key ] = value.trim(); } );

        if ( Object.values( data ).filter( i => i === '' ).length > 0 )
            throw new Error( "The form is missing some data. Please fill the nessecary fields." );

        if ( !/^[A-Z a-z]+$/.test( data.name ) )
            throw new Error( "The Name should only consist of Alphabets and space." );

        const today = new Date();

        const doj = new Date( data.joining_date );
        if (
            today.getFullYear() < doj.getFullYear() || 
            ( today.getFullYear() <= doj.getFullYear() && today.getMonth() < doj.getMonth() ) ||
            ( today.getFullYear() <= doj.getFullYear() && today.getMonth() <= doj.getMonth() && today.getDate() < doj.getDate() )
        )
            throw new Error( 'The Joining Date is not Valid.' );

        const dob = new Date( data.birth_date );
        if ( ( today.getFullYear() - dob.getFullYear() ) + ( ( today.getMonth() - dob.getMonth() ) / 12 ) < 18 )
            throw new Error( 'The Age is not eligible to work.' );

        if ( ![ 'male', 'female', 'other' ].includes( data.gender ) )
            throw new Error( 'The gender is invalid.' );

        if ( !/^[a-zA-Z0-9\s,.'-]{3,100}$/.test( data.address ) )
            throw new Error( "The Address should only consist of Alphabets, space, [-], [,], [.] and [\']." );

        if ( !/^\d{10}$/.test( data.contact ) )
            throw new Error( "The Contact No. should only consist of 10 numerics." );

        if ( !/^[a-z0-9.]+@[a-z]+\.[a-z]{2,}$/.test( data.email ) )
           throw new Error( "The Email is invalid." );

        let cookie = [], seq = 0;
        await cookieStore.get( COOKIE ).then( ( { value } ) => {

            [ cookie, seq ] = JSON.parse( value );
            cookie.push( { ...data, id: ++seq } );

        } ).catch( () =>
            cookie.push( { ...data, id: ++seq } )
        ).finally( () =>
            cookieStore.set( {
                name: COOKIE,
                value: JSON.stringify( [ cookie, seq ] ),
                expires: Temporal.Now.instant().add( { hours: 168 } ).epochMilliseconds,
                partitioned: true
            } )
        );

        Alert( 'Success', 'The record is saved.', 'success', 'Ok', () => { window.location.href = '../'; } );

    } catch ( error ) {

        const section = document.createElement( 'section' );
        section.id = 'formError';
        section.className = 'col-span-full text-xs text-red-500';
        section.innerText = error.message;

        e.target.appendChild( section );

    }

} );