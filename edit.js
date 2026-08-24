const param = new URLSearchParams( window.location.search );

const form = document.getElementById( 'form-edit-employee' );

document.addEventListener( 'DOMContentLoaded', async () => {

    if ( !param.has( 'id' ) || !param.get( 'id' ) )
        goHome();

    const id = Number( param.get( 'id' ) );

    let select = form.querySelector( '[name="department"]' );
    select.innerHTML = '<option value="" disabled selected hidden>Select Department</option>';

    departments.forEach( e => {

        const option = document.createElement( 'option' );
        option.value = option.innerText = e;
        select.appendChild( option );

    } );

    select = form.querySelector( '[name="designation"]' );
    select.innerHTML = '<option value="" disabled selected hidden>Select Designation</option>';

    designations.forEach( e => {

        const option = document.createElement( 'option' );
        option.value = option.innerText = e;
        select.appendChild( option );

    } );

    select = form.querySelector( '[name="country"]' );
    select.innerHTML = '<option value="" disabled selected hidden>Select Country</option>';

    Object.keys( CSC ).forEach( opt => {

        const option = document.createElement( 'option' );
        option.value = option.innerText = opt;
        select.appendChild( option );

    } );
    
    await cookieStore.get( COOKIE ).then( ( { value } ) => {

        const data = JSON.parse( value )[ 0 ].find( e => e.id === id );
        
        Object.keys( data ).filter( e =>
            ![ 'id', 'gender', 'country', 'state', 'city' ].includes( e )
        ).map( e => {
            form.querySelector( `[name="${ e }"]` ).value = data[ e ] || '';
        } );

        form.querySelectorAll( '[name="gender"]' ).forEach( e => { if( e.value === data.gender ) e.setAttribute( 'checked', true ) } );

        select.value = data.country;
        select.dispatchEvent( new Event( 'change' ) );

        select = form.querySelector( '[name="state"]' );
        select.value = data.state;
        select.dispatchEvent( new Event( 'change' ) );

        form.querySelector( '[name="city"]' ).value = data.city;

    } ).catch( () =>
        Alert( 'Failure', `Couldn't find records with ID: ${ id }!`, 'danger', 'Ok', goHome )
    );

} );

form.querySelector( '[name="country"]' ).addEventListener( 'change', () => {

    const { value } = form.querySelector( '[name="country"]' );
    if ( !value ) {

        form.querySelectorAll( '[name="state"], [name="city"]' ).forEach( elt => {

            elt.value = elt.innerHTML = '';
            elt.setAttribute( 'disabled', true );
            elt.classList.add( 'cursor-not-allowed' );

        } );
        return;

    }

    const state = form.querySelector( '[name="state"]' );
    state.innerHTML = '<option value="" disabled selected hidden>Select State</option>';

    Object.keys( CSC[ value ] ).forEach( opt => {

        const option = document.createElement( 'option' );
        option.value = option.innerText = opt;
        state.appendChild( option );

    } );

    state.classList.remove( 'cursor-not-allowed' );
    state.removeAttribute( 'disabled' );
    state.dispatchEvent( new Event( 'change' ) );

} );

form.querySelector( '[name="state"]' ).addEventListener( 'change', () => {

    const { value } = form.querySelector( '[name="state"]' );
    const city = form.querySelector( '[name="city"]' );

    if ( !value ) {

        city.value = city.innerHTML = '';
        city.setAttribute( 'disabled', true );
        city.classList.add( 'cursor-not-allowed' );
        return;

    }

    city.innerHTML = '<option value="" disabled selected hidden>Select City</option>';

    CSC[ form.querySelector( '[name="country"]' ).value ][ value ].forEach( opt => {

        const option = document.createElement( 'option' );
        option.value = option.innerText = opt;
        city.appendChild( option );

    } );

    city.classList.remove( 'cursor-not-allowed' );
    city.removeAttribute( 'disabled' )

} );

form.addEventListener( 'submit', async e => {

    e.preventDefault();

    e.target.children.namedItem( 'formError' )?.remove();

    const data = {},
        error = [];

    const section = document.createElement( 'section' );
    section.id = 'formError';
    section.className = 'col-span-full text-xs text-red-500';

    try {

        new FormData( e.target ).forEach( ( value, key ) => { data[ key ] = value.trim(); } );

        if ( Object.values( data ).filter( i => !i ).length > 0 ) {

            form.querySelectorAll( 'input:not([type="radio"]), textarea, select' ).forEach( elt => { if ( !elt.trim() ) fieldError ( elt ); } );

            section.innerText = "The form is missing some data. Please fill the necessary fields.";
            e.target.appendChild( section );
            return;

        }

        if ( !/^[A-Z\sa-z]{3,150}$/.test( data.name ) ) {

            error.push( "The Name should only consist of 3 to 150 characters of Alphabets and space." );
            fieldError( form.querySelector( '[name="name"]' ) );

        }

        if ( PlainDate.compare( PlainDate.from( data.joining_date ), Now.plainDateISO() ) >= 0 ) {

            error.push( 'The Joining Date is not Valid.' );
            fieldError( form.querySelector( '[name="joining_date"]' ) );

        }

        if (
            PlainDate.compare( PlainDate.from( data.birth_date ).add( { years: 18 } ), Now.plainDateISO() ) > 0 ||
            PlainDate.compare( PlainDate.from( data.birth_date ).add( { years: 18 } ), PlainDate.from( data.joining_date ) ) > 0
        ) {

            error.push( 'The Age is not eligible to work, should at least be 18.' );
            fieldError( form.querySelector( '[name="birth_date"]' ) );

        }

        if ( ![ 'male', 'female', 'other' ].includes( data.gender ) )
            error.push( 'The gender is invalid.' );

        if ( !departments.includes( data.department ) ) {

            error.push( 'The department is invalid.' );
            fieldError( form.querySelector( '[name="department"]' ) );

        }

        if ( !designations.includes( data.designation ) ) {

            error.push( 'The designation is invalid.' );
            fieldError( form.querySelector( '[name="designation"]' ) );

        }

        if ( !data.country in CSC ) {

            error.push( 'The country is invalid.' );
            fieldError( form.querySelector( '[name="country"]' ) );

        }

        if ( !data.state in CSC?.[ data.country ] ) {

            error.push( 'The state is invalid.' );
            fieldError( form.querySelector( '[name="state"]' ) );

        }

        if ( !CSC?.[ data.country ]?.[ data.state ]?.includes( data.city ) ) {

            error.push( 'The city is invalid.' );
            fieldError( form.querySelector( '[name="city"]' ) );

        }

        if ( !/^[a-zA-Z0-9\s,.'-]{3,200}$/.test( data.address ) ) {

            error.push( "The Address should only consist of 3 to 200 characters of Alphabets, space, [-], [,], [.] and [\']." );
            fieldError( form.querySelector( '[name="address"]' ) );

        }

        if ( !/^\d{10}$/.test( data.contact ) ) {

            error.push( "The Contact No. should only consist of 10 numerics." );
            fieldError( form.querySelector( '[name="contact"]' ) );

        }

        if ( !/^[a-z0-9.]+@[a-z]+\.[a-z]{2,}$/.test( data.email ) ) {

            error.push( "The Email is invalid." );
            fieldError( form.querySelector( '[name="email"]' ) );

        }

        if ( error.length > 0 ) {

            section.innerHTML = error.join( '<br>' );
            e.target.appendChild( section );
            return;

        }

        await cookieStore.get( COOKIE ).then( ( { value } ) => {

            const cookie = JSON.parse( value );

            if ( cookie[ 0 ].find( elt => elt.email === data.email ) ) {

                error.push( 'This email already exists.' );
                fieldError( form.querySelector( '[name="email"]' ) );

            }

            if ( cookie[ 0 ].find( elt => elt.contact === data.contact ) ) {

                error.push( 'This contact already exists.' );
                fieldError( form.querySelector( '[name="contact"]' ) );

            }

            if ( error.length > 0 ) {

                section.innerHTML = error.join( '<br>' );
                e.target.appendChild( section );
                return;

            }

            cookie[ 0 ] = cookie[ 0 ].map( e => ( e.id === Number( param.get( 'id' ) ) ? { ...e, ...data } : e ) );

            setCookie( JSON.stringify( cookie ) );
            Alert( 'Success', 'The record is been updated.', 'success', 'Ok', goHome );

        } ).catch( () =>
            Alert( 'Failure', 'Can\'t update the record.', 'danger', 'Ok' )
        );

    } catch ( error ) {

        console.error( error );
        section.innerText = error.message;
        e.target.appendChild( section );

    }

} );

document.getElementById( 'btn-back' ).addEventListener( 'click', goHome );

form.querySelectorAll( 'input:not([type="radio"]), textarea, select' ).forEach( elt =>
    elt.addEventListener( 'blur', e => fieldError( e.target, !e.target.value ) )
);

form.querySelector( '[name="department"]' ).addEventListener( 'change', () => {
    form.querySelector( '[name="designation"]' ).value = '';
} );