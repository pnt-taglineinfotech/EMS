globalThis.COOKIE = 'EMS';

const departments = [ 'ReactJS', 'NodeJS', 'Python' ];
const designations = [ 'Team Leader', 'Sr. Developer', 'Jr. Developer' ];
const CSC = {
    'India': {
        'Gujarat': [ 'Surat', 'Bharuch', 'Vapi' ],
        'Maharastra': [ 'Mumbai', 'Thane', 'Puna' ],
        'Rajasthan': [ 'Jaipur', 'Jodhpur', 'Maewad' ]
    },
    'Country2': {
        '2-State1': [ '2-1-City1', '2-1-City2', '2-1-City3' ],
        '2-State2': [ '2-2-City1', '2-2-City2', '2-2-City3' ],
        '2-State3': [ '2-3-City1', '2-3-City2', '2-3-City3' ]
    },
    'Country3': {
        '3-State1': [ '3-1-City1', '3-1-City2', '3-1-City3' ],
        '3-State2': [ '3-2-City1', '3-2-City2', '3-2-City3' ],
        '3-State3': [ '3-3-City1', '3-3-City2', '3-3-City3' ]
    }
};

const { PlainDate, Now, Duration } = Temporal;

const goHome = () => { window.location.href = './index.html'; };

const dialogVariant = {

    default: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        btn: 'bg-indigo-400 hover:bg-indigo-500'
    },
    success: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        btn: 'bg-green-400 hover:bg-green-500'
    },
    danger: {
        bg: 'bg-red-50',
        text: 'text-red-600',
        btn: 'bg-red-400 hover:bg-red-500'
    },
    warning: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        btn: 'bg-orange-400 hover:bg-orange-500'
    }

};

function Alert( title, message, variant = 'default', buttontext = 'Ok', action = () => {} ) {

    const { text, btn, bg } = dialogVariant[ variant ] || dialogVariant.default;

    const dialog = document.createElement( 'dialog' );
    dialog.className = `m-auto p-5 border border-gray-300 rounded-3xl md:w-2/5 ${ bg }`;

    let element = document.createElement( 'div' );
    element.className = `text-3xl font-semibold text-center ${ text }`;
    element.innerText = title;
    dialog.appendChild( element );

    element = document.createElement( 'div' );
    element.className = 'p-5';
    element.innerHTML = message;
    dialog.appendChild( element );

    element = document.createElement( 'button' );
    element.type = 'button';
    element.className = `block mx-auto text-lg ${ btn } text-white rounded-2xl px-4 py-2 cursor-pointer`;
    element.innerText = buttontext || 'Ok';
    element.addEventListener( 'click', () => {

        action();
        dialog.remove();

    } );
    dialog.appendChild( element );

    document.querySelector( 'main' ).appendChild( dialog );
    dialog.showModal();

}

function Confirm( title, message, variant = 'default', buttonText = 'Ok', action = () => {} ) {

    const { text, btn, bg } = dialogVariant[ variant ] || dialogVariant.default;

    const dialog = document.createElement( 'dialog' );
    dialog.id = 'confirm-dialog';
    dialog.className = `m-auto p-5 border border-gray-300 rounded-3xl md:w-2/5 ${ bg }`;

    let element = document.createElement( 'div' );
    element.className = `text-3xl font-semibold text-center ${ text }`;
    element.innerText = title;
    dialog.appendChild( element );

    element = document.createElement( 'div' );
    element.className = 'p-5';
    element.innerHTML = message;
    dialog.appendChild( element );

    element = document.createElement( 'div' );
    element.className = 'w-full flex justify-around';

    let button = document.createElement( 'button' );
    button.type = 'button';
    button.className = 'text-lg bg-gray-400 hover:bg-gray-500 text-white rounded-2xl px-4 py-2 cursor-pointer';
    button.innerText = 'Cancel';
    button.addEventListener( 'click', () => dialog.remove() );
    element.appendChild( button );

    button = document.createElement( 'button' );
    button.type = 'button';
    button.className = `text-lg ${ btn } text-white rounded-2xl px-4 py-2 cursor-pointer`;
    button.innerText = buttonText || 'Ok';
    button.addEventListener( 'click', () => {

        action();
        dialog.remove();

    } );
    element.appendChild( button );

    dialog.appendChild( element );

    document.querySelector( 'main' ).appendChild( dialog );

    dialog.showModal();

}

function fieldError ( element, flag = true ) {

    const thisClass = element.classList;
    const siblingClass = element.nextElementSibling.classList;

    if ( flag ) {

        thisClass.remove( 'ring-gray-300', 'focus:ring-gray-400' );
        thisClass.add( 'ring-red-300', 'focus:ring-red-400', 'bg-red-200' );

        siblingClass.remove( 'text-gray-600' );
        siblingClass.add( 'text-red-600',  );

        return;

    }

    thisClass.remove( 'ring-red-300', 'focus:ring-red-400', 'bg-red-200' );
    thisClass.add( 'ring-gray-300', 'focus:ring-gray-400' );

    siblingClass.remove( 'text-red-600' );
    siblingClass.add( 'text-gray-600' );

}

function setCookie ( data ) {

    cookieStore.set( {
        name: COOKIE,
        value: data,
        maxAge: Duration.from( { hours: 168 } ).total( { unit: 'milliseconds' } ),
        partitioned: true
    } );

}