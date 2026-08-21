let checked = [];

async function loadData( filter = { name: '', department: '', designation: '', joining_date: '', contact: '', email: '' } ) {

    const tableBody = document.getElementById( 'table-data' );
    tableBody.innerHTML = '<section class="p-5 text-lg text-center text-gray-500">No Data Found!</section>';

    await cookieStore.get( COOKIE ).then( ( { value } ) => {

        let data = JSON.parse( value )[ 0 ];

        if ( filter?.name )
            data = Object.values( data ).filter( elt => RegExp( filter.name, 'i' ).test( elt.name ) );

        if ( filter?.department )
            data = Object.values( data ).filter( elt => RegExp( filter.department, 'i' ).test( elt.department ) );

        if ( filter?.designation )
            data = Object.values( data ).filter( elt => RegExp( filter.designation, 'i' ).test( elt.designation ) );

        if ( filter?.joining_date )
            data = Object.values( data ).filter( elt => filter.joining_date === elt.joining_date );

        if ( filter?.contact )
            data = Object.values( data ).filter( elt => RegExp( filter.contact, 'i' ).test( elt.contact ) );

        if ( filter?.email )
            data = Object.values( data ).filter( elt => RegExp( filter.email, 'i' ).test( elt.email ) );

        if( !data.length )
            throw Error();

        tableBody.innerHTML = '';

        Object.values( data ).map( elt => {

            const tableRow = document.createElement( 'section' );
            tableRow.className = "grid grid-cols-9 hover:bg-slate-100 cursor-pointer";

            let cell = document.createElement( 'section' );
            cell.className = "p-5 text-center content-center cursor-auto";
            cell.addEventListener( 'click', e => e.stopPropagation() );

            const input = document.createElement( 'input' );
            input.type = "checkbox";
            input.className = "size-5";
            input.addEventListener( 'click', e => {

                e.stopPropagation();
                if( e.target.checked )
                    checked.push( elt.id );
                else
                    checked = checked.filter( id => id !== elt.id );

                if ( checked.length === 0 ) {

                    document.getElementById( 'delete-employee' ).classList.remove( 'md:block' );
                    document.getElementById( 'sm-delete-employee' ).classList.add( 'hidden' );

                } else {

                    document.getElementById( 'delete-employee' ).classList.add( 'md:block' );
                    document.getElementById( 'sm-delete-employee' ).classList.remove( 'hidden' );

                }

            } );
            cell.appendChild( input );
            tableRow.appendChild( cell );

            cell = document.createElement( 'section' );
            cell.className = "col-span-2 p-5 text-center content-center";
            cell.innerText = elt.name;
            tableRow.appendChild( cell );

            cell = document.createElement( 'section' );
            cell.className = "p-5 text-center content-center";
            cell.innerText = elt.department;
            tableRow.appendChild( cell );

            cell = document.createElement( 'section' );
            cell.className = "p-5 text-center content-center";
            cell.innerText = elt.designation;
            tableRow.appendChild( cell );

            cell = document.createElement( 'section' );
            cell.className = "p-5 text-center content-center";
            cell.innerText = elt.joining_date;
            tableRow.appendChild( cell );

            cell = document.createElement( 'section' );
            cell.className = "p-5 text-center content-center";
            cell.innerText = elt.contact;
            tableRow.appendChild( cell );

            cell = document.createElement( 'section' );
            cell.className = "col-span-2 p-5 text-center content-center";
            cell.innerText = elt.email;
            tableRow.appendChild( cell );

            tableRow.addEventListener( 'click', () => {
                
                const modal = document.createElement( 'dialog' );
                modal.id = "view-employee";
                modal.className = "m-auto p-5 border border-gray-300 rounded-3xl w-full md:w-2/3";

                let section = document.createElement( 'section' );
                section.className = "flex flex-row justify-between items-center";
                section.innerHTML = `<section class="text-3xl font-semibold content-center">Employee Details</section>`;

                let button = document.createElement( 'button' );
                button.type = 'button';
                button.className = "h-fit md:text-lg bg-red-400 text-white rounded-lg px-4 py-2 hover:bg-red-500 cursor-pointer";
                button.innerText = "Cancel";
                button.addEventListener( 'click', () => modal.remove() );
                section.appendChild( button );

                modal.appendChild( section );

                section = document.createElement( 'section' );
                section.className = "mt-5 px-5 grid grid-cols-1 md:grid-cols-6 gap-2";

                let subSection = document.createElement( 'section' );
                subSection.className = "font-semibold content-center";
                subSection.innerText = "Employee Name";
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "md:col-span-5 p-2 border border-gray-300 rounded-2xl";
                subSection.innerText = elt.name;
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "font-semibold content-center";
                subSection.innerText = "Department";
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "md:col-span-2 p-2 border border-gray-300 rounded-2xl";
                subSection.innerText = elt.department;
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "font-semibold content-center";
                subSection.innerText = "Designation";
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "md:col-span-2 p-2 border border-gray-300 rounded-2xl";
                subSection.innerText = elt.designation;
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "font-semibold content-center";
                subSection.innerText = "Joining Date";
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "md:col-span-2 p-2 border border-gray-300 rounded-2xl";
                subSection.innerText = elt.joining_date;
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "font-semibold content-center";
                subSection.innerText = "Date Of Birth";
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "md:col-span-2 p-2 border border-gray-300 rounded-2xl";
                subSection.innerText = elt.birth_date;
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "font-semibold content-center";
                subSection.innerText = "Gender";
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "md:col-span-2 p-2 border border-gray-300 rounded-2xl";
                subSection.innerText = elt.gender;
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "font-semibold content-center";
                subSection.innerText = "Contact No.";
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "md:col-span-2 p-2 border border-gray-300 rounded-2xl";
                subSection.innerText = elt.contact;
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "font-semibold content-center";
                subSection.innerText = "Address";
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "md:col-span-5 h-30 p-2 border border-gray-300 rounded-2xl";
                subSection.innerText = `${ elt.address }, ${ elt.city }, ${ elt.state }, ${ elt.country }`;
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "font-semibold content-center";
                subSection.innerText = "Email";
                section.appendChild( subSection );

                subSection = document.createElement( 'section' );
                subSection.className = "md:col-span-5 p-2 border border-gray-300 rounded-2xl";
                subSection.innerText = elt.email;
                section.appendChild( subSection );

                modal.appendChild( section );

                section = document.createElement( 'section' );
                section.className = "mt-10 flex flex-row justify-around";

                button = document.createElement( 'button' );
                button.type = 'button';
                button.className = "w-1/4 md:w-1/8 py-2 bg-slate-500 text-white text-center border border-slate-400 rounded-lg hover:bg-slate-600 cursor-pointer";
                button.innerText = "Edit";
                button.addEventListener( 'click', () => { window.location.href = `./edit.html?id=${ elt.id }`; } );
                section.appendChild( button );

                button = document.createElement( 'button' );
                button.type = 'button';
                button.className = "w-1/4 md:w-1/8 py-2 bg-red-500 text-white text-center border border-red-400 rounded-lg hover:bg-red-600 cursor-pointer";
                button.innerText = "Delete";
                button.addEventListener( 'click', () => {

                    const confirm = async () => {

                        await cookieStore.get( COOKIE ).then( ( { value } ) => {

                            const cookie = JSON.parse( value );
                            cookie[ 0 ] = Object.values( cookie[ 0 ] ).filter( e => e.id !== elt.id );

                            cookieStore.set( {
                                name: COOKIE,
                                value: JSON.stringify( cookie ),
                                expires: Temporal.Now.instant().add( { hours: 168 } ).epochMilliseconds,
                                partitioned: true
                            } );

                            Alert( 'Success', `${ elt.name } is been deleted from the records.`, 'success', 'Ok', () => window.location.reload() );

                        } ).catch( () =>
                            Alert( 'Failure', `Couldn't find ${ elt.name }!`, 'danger' )
                        );

                    }
                    Confirm( 'Delete Comfirmation', `Do you want to delete ${ elt.name } ?`, 'warning', 'Delete', confirm );

                } );
                section.appendChild( button );

                modal.appendChild( section );

                document.querySelector( 'main' ).appendChild( modal );
                modal.showModal();
            
            } );

            tableBody.appendChild( tableRow );

        } );

    } ).catch( error => { console.error( error );
        tableBody.innerHTML = '<section class="p-5 text-lg text-center text-gray-500">No Data Found!</section>';
    } );

}

document.addEventListener( 'DOMContentLoaded', () => {

    let select = document.querySelector( '#filter [name="department"]' );
    select.innerHTML = '<option value="">Select Department</option>';

    departments.forEach( e => {

        const option = document.createElement( 'option' );
        option.value = option.innerText = e;
        select.appendChild( option );

    } );

    select = document.querySelector( '#filter [name="designation"]' );
    select.innerHTML = '<option value="">Select Designation</option>';

    designations.forEach( e => {

        const option = document.createElement( 'option' );
        option.value = option.innerText = e;
        select.appendChild( option );

    } );

    loadData();

} );

document.getElementsByName( 'add-employee' ).forEach( e => e.addEventListener( 'click', () => { window.location.href = './add.html' } ) );

document.querySelectorAll( '#delete-employee, #sm-delete-employee' ).forEach( e => e.addEventListener( 'click', () => {

    if ( !checked )
        return;

    const confirm = async () => {

    await cookieStore.get( COOKIE ).then( ( { value } ) => {

            const cookie = JSON.parse( value );
            cookie[ 0 ] = Object.values( cookie[ 0 ] ).filter( e => !checked.includes( e.id ) );

            cookieStore.set( {
                name: COOKIE,
                value: JSON.stringify( cookie ),
                expires: Temporal.Now.instant().add( { hours: 168 } ).epochMilliseconds,
                partitioned: true
            } );

            Alert( 'Success', 'All the selected records are been deleted from the records.', 'success', 'Ok', () => window.location.reload() );

        } ).catch( () =>
            Alert( 'Failure', 'Couldn\'t delete the selected records!', 'danger' )
        );

    }
    Confirm( 'Delete Comfirmation', `Do you want to delete all the selected records ?`, 'warning', 'Delete', confirm );

} ) );

document.getElementById( 'filter' ).addEventListener( 'submit', e => {

    e.preventDefault();

    const data = {};

    new FormData( e.target ).forEach( ( val, key ) => { data[ key ] = val.trim(); } );

    loadData( Object.entries( data ).filter( val => val[ 1 ] !== '' ).reduce( ( obj, val ) => ( { ...obj, [ val[ 0 ] ]: val[ 1 ] } ), {} ) );

} );

document.getElementById( 'filter-employee' ).addEventListener( 'click', () => {

    const { classList } = document.getElementById( 'filter' );
    classList.toggle( 'flex' );
    classList.toggle( 'hidden' );

} );

document.getElementById( 'btn-reset' ).addEventListener( 'click', loadData );