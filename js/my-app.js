// Initialize app{}
var myApp = new Framework7({
    material:true
});

// If we need to use custom DOM library, let's save it to $$$$ variable:
var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:


    // If it is webapp, we can enable hash navigation:
    //pushState: true

});


$('.search_btn').on('click',function (event) {
    var user_type = $('.user_type').val();
    //    var subject = $('.subject').val();
    //    var category =  $('.category').val();
    var city =  $('#cities').val();

    if(city !== "" && user_type !== ""){
        window.localStorage.setItem('user_type',user_type);
        window.localStorage.setItem('city',city);

        //  window.localStorage.setItem('category',category);
        //  window.localStorage.setItem('subject',subject);
        myApp.closeModal();
        mainView.router.loadPage('search-result.html');
    }else{
        myApp.alert("You must fill all fields",'Alert!!')
    }
});


$$('.popup-search').on('popup:open', function () {

    cityGetter();

    $('.search_btn').on('click',function (event) {

        var user_type = $('.user_type').val();
        //    var subject = $('.subject').val();
        //    var category =  $('.category').val();
        var city =  $('#cities').val();


        if(city !== "" && user_type !== "" ){
            window.localStorage.setItem('user_type',user_type);
            window.localStorage.setItem('city',city);

            //  window.localStorage.setItem('category',category);
            //  window.localStorage.setItem('subject',subject);
            myApp.closeModal();
            mainView.router.loadPage('search-result.html');
        }else{
            myApp.alert("You must fill all fields",'Alert!!')
        }
    });
});


var user_type =  window.localStorage.getItem('user_type');
if(user_type == 1){
    $$('#membership').hide();
}

var token = window.localStorage.getItem('auth_id');
if(!token){
    $$('#login').show();
    $$('#logout').hide();
    $$('#signup').show();
}else{
    $$('#login').hide();
    $$('#signup').hide();
    $$('#logout').show();
}

if(!token){
    $$('#membership').hide();
}else{
    $$('#membership').show();
}




$$('#log_out').on('click',function () {
    myApp.alert('You have signed out!','Alert!');
    window.localStorage.clear();
    $$('#login').show();
    $$('#logout').hide();
    $$('#signup').show();
    $$('#membership').hide();
});

$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;
    var token = window.localStorage.getItem('token');
    if (page.name === 'index') {
        $.get('http://mytutor.ae/mobile/public/api/checkForExpiry',function (data) {
            if(data == 'Account Expired'){
                myApp.alert(data,'Alert!');
            }
        });

        cityGetter();
    }

    if (page.name === 'contact') {

        $('#send_btn').on('click',function(){
            $(this).prop('disabled',true);
            var name = $('#name').val();
            var email = $('#email').val();
            var contact_no = $('#contact_no').val();
            var message = $('#message').val();

            myApp.showPreloader();
            Email.send(email,
                "managercoursework@gmail.com",
                "Email Form My Tutor from "+name,
                message,
                "smtp.gmail.com",
                "engrsk621@gmail.com",
                "lirzwcozxqcklnds");
            myApp.hidePreloader();
            myApp.alert("Message Sent!! You will be contacted soon",'Alert!');
            mainView.router.loadPage('index.html');
        });
    }


    if (page.name === 'search-result') {


        var user_type =  window.localStorage.getItem('user_type');
        //  var subject = window.localStorage.getItem('subject');
        //   var category =   window.localStorage.getItem('category');
        var city =   window.localStorage.getItem('city');

        var name = "";
        myApp.showPreloader();
        $.post('http://mytutor.ae/mobile/public/api/search',{user_type:user_type,city:city},function (data) {

            console.log(data);
             window.localStorage.removeItem('user_type');
            //  window.localStorage.removeItem('subject');
            //    window.localStorage.removeItem('category');
             window.localStorage.removeItem('city');

            myApp.hidePreloader();

            if(data.flag == 1){
                $('.no_result').show();
            }else{
                $('.no_result').hide();
            }

            $.each(data.user,function (key,value) {

                if(user_type == 1){

                    name = value.F_Name+' '+value.L_Name;

                }else if(user_type == 2){
                    name = value.F_Name+' '+value.L_Name;
                }else if(user_type == 3){
                    name = value.Name;
                }

                $('.content-block').append('<div class="thumbnail">' +
                    '<div class="data-table data-table-init card"><div class="card-content">' +
                    '<img src="img/avatar/student.png" class="responsive" /><table>' +
                    '<tbody><tr><th style="border-top: 1px solid #e0e0e0;">Name</th>' +
                    '<td id="name">'+name+'</td></tr><tr><th>City</th><td>'+value.city_name+'</td></tr>' +
                    '</tbody></table>' +
                    '<br/><div class="buttons"><a href="#" data-id="'+value.ID+'" onclick="getID(this)"  class="button button-fill button-raised">View Ad</a>' +
                    '<a href="student-profile.html"  data-id="'+value.ID+'" onclick="getID(this)" class="profile button button-fill button-raised">View Profile</a>' +
                    '<a href="message.html" data-id="'+value.ID+'" onclick="getID(this)" class="button button-fill button-raised">Send Message</a></div>' +
                    '</div></div></div>');

                if(user_type == 1){

                    $('.profile').prop('href','student-profile.html');

                }else if(user_type == 2){
                    $('.profile').prop('href','tutor-profile.html');
                }else if(user_type == 3){
                    $('.profile').prop('href','institute-profile.html');
                }
            })
        });

    }

    if (page.name === 'student-signup') {

        cityGetter();

        $.get('http://mytutor.ae/mobile/public/api/getAllLevels',function (data) {
            // console.log(data);
            $.each(data,function (key,value) {
                $('.level').append('<option value="'+value.ID+'">'+value.Name+'</option>');
            });
        });

        $.get('http://mytutor.ae/mobile/public/api/getAllSubjects',function (data) {
            // console.log(data);
            $.each(data,function (key,value) {
                $('.subject').append('<option value="'+value.ID+'">'+value.Name+'</option>');
            });
        });

        $.get('http://mytutor.ae/mobile/public/api/getAllCategory',function (data) {
            // console.log(data);
            $.each(data,function (key,value) {
                $('.category').append('<option value="'+value.ID+'">'+value.Name+'</option>');
            });
        });


        $('#signup_btn').on('click',function () {
            event.preventDefault();
            var f_name = $('#f_name').val();
            var l_name = $('#l_name').val();
            var address = $('#address').val();
            var city = $('#cities').val();
            var mobile = $('#mobile').val();
            var gender = $('#gender').val();
            var email = $('#email').val();
            var password = $('#password').val();
            var c_password = $('#c_password').val();
            var category_id = $('#category_id').val();
            var subject_id = $('#subject_id').val();
            var level_id = $('#level_id').val();
            var hour_per_week = $('#hour_per_week').val();

            var description = $('#description').val();
            var user_type = 1;

            if(password !== c_password ){
                myApp.alert('Password do not Match','Alert!');
            }else{
                myApp.showPreloader();
                //console.log(hour_per_week);
                $.post('http://mytutor.ae/mobile/public/api/postSignup',{mobile:mobile,gender:gender,f_name:f_name,l_name:l_name,address:address,
                    city:city,email:email,password:password,category_id:category_id,subject_id:subject_id,
                    level_id:level_id,hour_per_week:hour_per_week,description:description,user_type:user_type},function (data) {
                    //console.log(data);
                    myApp.hidePreloader();
                    if(data == 'Email already taken.'){
                        myApp.alert(data,'Alert!');
                    }else{

                        myApp.alert(data,'Alert!');
                        mainView.router.loadPage('signin.html');
                    }

                });
            }



        });

    }
    if (page.name === 'tutor-signup') {
        cityGetter();

        $('#signup_btn').on('click',function () {
            event.preventDefault();
            var f_name = $('#f_name').val();
            var l_name = $('#l_name').val();
            var address = $('#address').val();
            var city = $('#cities').val();
            var email = $('#email').val();
            var password = $('#password').val();
            var gender = $('#gender').val();
            var c_password = $('#c_password').val();
            var category_id = $('#category_id').val();
            var subject_id = $('#subject_id').val();
            var level_id = $('#level_id').val();
            var hour_per_week = $('#hour_per_week').val();
            var description = $('#description').val();
            var title = $('#title').val();
            var dob = $('#dob').val();
            var mobile = $('#mobile').val();
            var phone = $('#phone').val();
            var user_type = 2;
            var key = 'someRandomKey';
            if(password !== c_password ){
                myApp.alert('Password do not Match','Alert!');
            }else{
                myApp.showPreloader();
                //console.log(hour_per_week);
                $.post('http://mytutor.ae/mobile/public/api/postSignup',{gender:gender,f_name:f_name,l_name:l_name,address:address,
                    city:city,email:email,password:password,category_id:category_id,subject_id:subject_id,
                    level_id:level_id,hour_per_week:hour_per_week,description:description,user_type:user_type,title:title,
                    dob:dob,mobile:mobile,phone:phone},function (data) {
                    //console.log(data);
                    myApp.hidePreloader();
                    if(data == 'Email already taken.'){
                        myApp.alert(data,'Alert!');
                    }else{
                        myApp.alert(data,'Alert!');
                        mainView.router.loadPage('signin.html');

                    }

                });
            }


        });

    }
    if (page.name === 'institute-signup') {
        cityGetter();
        $('#signup_btn').on('click',function () {
            event.preventDefault();
            var address = $('#address').val();
            var city = $('#cities').val();
            var email = $('#email').val();
            var password = $('#password').val();
            var c_password = $('#c_password').val();
            var category_id = $('#category_id').val();
            var subject_id = $('#subject_id').val();
            var level_id = $('#level_id').val();
            var hour_per_week = $('#hour_per_week').val();
            var description = $('#description').val();
            var dob = $('#dob').val();
            var mobile = $('#mobile').val();
            var phone = $('#phone').val();
            var institute = $('#institute').val();
            var c_person = $('#c_person').val();
            var landline = $('#landline').val();
            var user_type = 3;
            var key = 'someRandomKey';
            if(password !== c_password ){
                myApp.alert('Password do not Match','Alert!');
            }else{
                myApp.showPreloader();
                //console.log(hour_per_week);
                $.post('http://mytutor.ae/mobile/public/api/postSignup',{address:address,
                    city:city,email:email,password:password,category_id:category_id,subject_id:subject_id,
                    level_id:level_id,hour_per_week:hour_per_week,description:description,user_type:user_type,
                    dob:dob,mobile:mobile,phone:phone,institute:institute,c_person:c_person,landline:landline},function (data) {
                    //console.log(data);
                    myApp.hidePreloader();
                    if(data == 'Email already taken.'){
                        myApp.alert(data,'Alert!');
                    }else{

                        myApp.alert(data,'Alert!');
                        mainView.router.loadPage('signin.html');
                    }

                });
            }


        });

    }
    if (page.name === 'signin') {

        $('#login_btn').on('click',function () {
            var email = $('#email').val();
            var password = $('#password').val();
            var user_type = $('#user_type').val();
            myApp.showPreloader();
            $.post('http://mytutor.ae/mobile/public/api/postLogin',{email:email,password:password,user_type:user_type},function (data) {
                myApp.hidePreloader();
                if(data.error){
                    myApp.alert(data.error,'Alert!');
                }else{
                    mainView.router.loadPage('index.html');
                    myApp.alert("You have successfully signed in!!",'Alert!');
                    window.localStorage.setItem('user_type',data.user_type);
                    window.localStorage.setItem('auth_id',data.user['ID']);

                    var user_type =  window.localStorage.getItem('user_type');
                    if(user_type == 1){
                        $$('#membership').hide();
                    }else{
                        $$('#membership').show();
                    }

                    $$('#login').hide();
                    $$('#signup').hide();
                    $$('#logout').show();
                }

                console.log(data);
            });
        });
    }
    if (page.name === 'search-student') {

        myApp.showPreloader();
        $.get('http://mytutor.ae/mobile/public/api/getAllStudent',function (data) {
            myApp.hidePreloader();
            console.log(data);
            $.each(data,function (key,value) {

                $('#main').append('<div class="thumbnail">' +
                    '<div class="data-table data-table-init card"><div class="card-content">' +
                    '<img src="img/avatar/student.png" class="responsive" /><table>' +
                    '<tbody><tr><th style="border-top: 1px solid #e0e0e0;">Name</th>' +
                    '<td>'+value.F_Name+' '+value.L_Name+'</td></tr><tr><th>City</th><td>'+value.City+'</td></tr>' +
                    '<tr><th>Category</th><td>'+value.category_name+'</td>' +
                    '</tr><tr><th style="border-bottom: none!important;">Subjects</th>' +
                    '<td>'+value.subject_name+'</td></tr></tbody></table>' +
                    '<br/><div class="buttons"><a href="#" data-id="'+value.ID+'" onclick="mailSignin(this);getID(this)"  class="button button-fill button-raised">View Ad</a>' +
                    '<a href="student-profile.html" data-id="'+value.ID+'" onclick="mailSignin(this);getID(this)" class="button button-fill button-raised">View Profile</a>' +
                    '<a href="message.html" data-id="'+value.ID+'" onclick="mailSignin(this);getID(this)" class="button button-fill button-raised">Send Message</a></div>' +
                    '</div></div></div>');
            })
        });

    }

    if (page.name === 'search-institute') {
        myApp.showPreloader();
        $.get('http://mytutor.ae/mobile/public/api/getAllInstitute',function (data) {
            myApp.hidePreloader();
            //console.log(data);
            $.each(data,function (key,value) {

                $('#main').append('<div class="thumbnail"><div class="data-table data-table-init card">' +
                    '<div class="card-content"><img src="img/avatar/institute.png" class="responsive" />' +
                    '<h3>'+value.Name+'</h3>' +
                    '<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit.' +
                    '</p><table><tbody><tr><th>City</th><td>'+value.city_name+'</td>' +
                    '</tr>' +
                    '</tbody></table>' +
                    '<br/><div class="buttons"><a href="institute-profile.html" data-id="'+value.ID+'" onclick="mailSignin(this);getID(this)" class="button button-fill button-raised">View Profile</a>' +
                    '<a href="message.html" data-id="'+value.ID+'" onclick="mailSignin(this);getID(this)" class="button button-fill button-raised">Send Message</a>' +
                    '<a href="" class="button button-fill button-raised">Read Reviews</a></div></div></div>');


            });
        });


    }

    if (page.name === 'search-tutor') {
        myApp.showPreloader();
        $.get('http://mytutor.ae/mobile/public/api/getAllTutor',function (data) {
            myApp.hidePreloader();
            // console.log(data);
            $.each(data,function (key,value) {

                $('#main').append(' <div class="thumbnail"><div class="data-table data-table-init card">' +
                    ' <div class="card-content">' +
                    '<img src="img/avatar/tutor.png" class="responsive" />' +
                    '<h3>'+value.F_Name+' '+value.L_Name+'</h3><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.' +
                    '</p><table><tbody> <tr><th>City</th><td>'+value.city_name+'</td>' +
                    '</tr>' +
                    ' </tbody></table><br/><div class="buttons">' +
                    '<a href="tutor-profile.html"  data-id="'+value.ID+'" onclick="mailSignin(this);getID(this)" class="button button-fill button-raised">View Profile</a>' +
                    '<a href="message.html"  data-id="'+value.ID+'" onclick="mailSignin(this);getID(this)" class="button button-fill button-raised">Send Message</a>' +
                    '<a href="" class="button button-fill button-raised">Read Reviews</a>' +
                    '</div></div></div>');
            });
        });

    }

    if (page.name === 'inbox') {
        myApp.showPreloader();
        $.get('http://mytutor.ae/mobile/public/api/getAllConversation',function (data) {
            // console.log(data);
            myApp.hidePreloader();

            var receiver_id = 0;
            var receiver = '';
            console.log(data);
            $.each(data.conversation,function (key,value) {

                var auth_id =   window.localStorage.getItem('auth_id');
                if(auth_id != value.user_one){
                    receiver_id = value.user_one;
                }else if(auth_id != value.user_two){
                    receiver_id = value.user_two;
                }
                if(data.receiver[key].f_name == '' && data.receiver[key].l_name){

                    receiver =  data.receiver[key].institute;
                }else{
                    receiver = data.receiver[key].f_name+' '+data.receiver[key].l_name;
                }


                $('#main').append('<li class="swipeout"><div class="swipeout-content" ><a href="message.html" class="item-link item-content" onclick="msg_getter(this)" data-receiver="'+receiver_id+'" data-id="'+value.id+'">' +
                    '<div class="item-inner">' +
                    '<div class="item-title-row">' +
                    '<div class="item-title">'+receiver+'</div>' +
                    '<div class="item-after">17:14</div>' +
                    '</div>' +
                    '<div class="item-text">'+data.message[key].message+'</div></div></a></div></li>');
            });


        });



    }

    if (page.name === 'message') {
        // Conversation flag
        var conversationStarted = false;

// Init Messages
        var myMessages = myApp.messages('.messages', {
            autoLayout:true
        });

// Init Messagebar
        var myMessagebar = myApp.messagebar('.messagebar');

// Handle message


        // Enable pusher logging - don't include this in production
        // Pusher.logToConsole = true;

        var pusher = new Pusher('cbf06877dfba3f68eece', {
            cluster: 'eu',
            encrypted: true
        });

        var channel = pusher.subscribe('my-channel');
        channel.bind('my-event', function(data) {

            // console.log(data);

            $('.messages').animate({
                scrollTop: $('.messages').height()
            }, 1000);

            var auth_id =   window.localStorage.getItem('auth_id');

            if(data.sender_id == auth_id)
            {
                $('.messages').append('<div class="messages-date">Sunday, Feb 9 <span>12:58</span></div>' +
                    '<div class="message message-sent"><div class="message-text">'+data.message+'</div></div>');
            }else{
                $('.messages').append('ads<div class="messages-date">Sunday, Feb 9 <span>12:58</span></div>' +
                    '<div class="message message-received"><div class="message-text">'+data.message+'</div></div>');
            }

        });


        var c_id =   window.localStorage.getItem('c_id');
        var id =   window.localStorage.getItem('id');

        if(!c_id){
            $.post('http://mytutor.ae/mobile/public/api/getAllMessages',{id:id},function (data) {

                console.log(data);
                $.each(data.message,function (key,value) {
                    //console.log(value);
                    if(value.sender_id == data.user['id'])
                    {
                        $('.messages').append('<div class="messages-date">Sunday, Feb 9 <span>12:58</span></div>' +
                            '<div class="message message-sent"><div class="message-text">'+value.message+'</div></div>');
                    }else{

                        $('.messages').append('<div class="messages-date">Sunday, Feb 9 <span>12:58</span></div>' +
                            '<div class="message message-received"><div class="message-text">'+value.message+'</div></div>');
                    }

                });
            });
        }else{
            $.post('http://mytutor.ae/mobile/public/api/getAllMessages',{c_id:c_id},function (data) {

                //console.log(data);
                $.each(data.message,function (key,value) {
                    //console.log(value);
                    if(value.sender_id == data.user['id'])
                    {
                        $('.messages').append('<div class="messages-date">Sunday, Feb 9 <span>12:58</span></div>' +
                            '<div class="message message-sent"><div class="message-text">'+value.message+'</div></div>');
                    }else{

                        $('.messages').append('<div class="messages-date">Sunday, Feb 9 <span>12:58</span></div>' +
                            '<div class="message message-received"><div class="message-text">'+value.message+'</div></div>');
                    }

                });
            });
        }
        $$('.messagebar .link').on('click', function () {
            // Message text
            var messageText = myMessagebar.value().trim();
            // Exit if empy message
            if (messageText.length === 0) return;

            // Empty messagebar
            myMessagebar.clear();

            var receiver_id = window.localStorage.getItem('receiver_id');

            var token = window.localStorage.getItem('token');

            $.post('http://mytutor.ae/mobile/public/api/postMessages',{id:id,receiver_id:receiver_id,message:messageText},function (data) {
                console.log(data);
            });

            // Update conversation flag
            conversationStarted = true;
        });

    }

    if (page.name === 'membership') {

        var user_type =  window.localStorage.getItem('user_type');
        if(user_type == 2){
            $('.institute').hide();
            $('.tutor').show();
        }else if(user_type == 3){
            $('.institute').show();
            $('.tutor').hide();
        }

        $('#basic').on('click',function () {

            var period =  window.localStorage.getItem('period');
            myApp.showPreloader();
            $.post('http://mytutor.ae/mobile/public/api/store',{plan_type:'basic',period:period},function (data) {
                myApp.hidePreloader();
                if(data == 'success'){
                    myApp.alert('You have successfully subscribed to Basic Subscription','Alert!');
                }
            });
        });

        $('#premium').on('click',function () {
            myApp.showPreloader();
            var period =  window.localStorage.getItem('period');
            var price = window.localStorage.getItem('price');
            $.post('http://mytutor.ae/mobile/public/api/store',{plan_type:'premium',period:period,plan_price:price},function (data) {
                myApp.hidePreloader();
                //  window.location.href = data;
                console.log(data);
                // if(data == 'success'){
                //     myApp.alert('You have successfully subscribed to Premium Subscription');
                // }
            });

        });

    }

    if (page.name === 'student-profile') {
        myApp.showPreloader();
        var id = window.localStorage.getItem('id');
        $.post('http://mytutor.ae/mobile/public/api/student_profile',{id:id},function (data) {
            // console.log(data);
            myApp.hidePreloader();
            $('#name').text(data[0].F_Name+' ' +data[0].L_Name);
            $('#city').text(data[0].city_name);
            $('#message_btn').data('id',data[0].ID);
            window.localStorage.removeItem('id');

        });
    }

    if (page.name === 'tutor-profile') {

        var id = window.localStorage.getItem('id');
        myApp.showPreloader();
        $.post('http://mytutor.ae/mobile/public/api/tutor_profile',{id:id},function (data) {
            myApp.hidePreloader();
            //console.log(data);
            $('#name').text(data[0].F_Name+' ' +data[0].L_Name);
            $('#city').text(data[0].city_name);
            window.localStorage.removeItem('id');

        });
    }

    if (page.name === 'institute-profile') {

        var id = window.localStorage.getItem('id');
        myApp.showPreloader();
        $.post('http://mytutor.ae/mobile/public/api/institute_profile',{id:id},function (data) {
            myApp.hidePreloader();
            // console.log(data);
            $('#institute').text(data[0].Name);
            $('#c_person').text(data[0].Contact_Person);
            $('#address').text(data[0].Address);
            $('#city').text(data[0].city_name);
            $('#email').text(data[0].Email);
            window.localStorage.removeItem('id');

        });
    }

});

function getPeriod(element) {
    var period = $(element).val();
    var price = $(element).data('price');
    window.localStorage.setItem('period',period);
    window.localStorage.setItem('price',price);

    $('.cradio').change(function () {
        $('.cradio').not(this).prop('checked', false);
    });


}

function msg_getter(element) {

    var c_id = $(element).data('id');
    var receiver_id = $(element).data('receiver');
    window.localStorage.setItem('c_id',c_id);
    window.localStorage.setItem('receiver_id',receiver_id);
}
function getID(element) {

    //  $(element).attr('href','membership.html');
    var id = $(element).data('id');
    window.localStorage.setItem('id',id);
    var token = window.localStorage.getItem('token');
    var user_type = window.localStorage.getItem('user_type');
    $.post('http://mytutor.ae/mobile/public/api/permissions',{id:id},function (data) {

        if(data == 'allowed'){

        }else{

            if(myApp.confirm('You Have to be a member to use this functionality!!')){
                mainView.router.loadPage('membership.html');
            }

        }
    });

}

function mailSignin(element){
    var token = window.localStorage.getItem('auth_id');
    if(!token){
        myApp.alert("You must signin to access this",'Alert!');
        $(element).prop('href','#');
    }
}

function areaGiver(city) {
    $('#area option:not(:first)').remove();
    if(city == 'Ajman'){
        var ajman = [
            {
                "Places": "Ain Ajman",
                "": ""
            },
            {
                "Places": "Ajman",
                "": ""
            },
            {
                "Places": "Al Ameera Village",
                "": ""
            },
            {
                "Places": "Al Bustan",
                "": ""
            },
            {
                "Places": "Al Butain",
                "": ""
            },
            {
                "Places": "Al Hamidiyah",
                "": ""
            },
            {
                "Places": "Al Humaid City",
                "": ""
            },
            {
                "Places": "Al Ittihad Village",
                "": ""
            },
            {
                "Places": "Al Naimiya",
                "": ""
            },
            {
                "Places": "Al Nakhil",
                "": ""
            },
            {
                "Places": "Al Owan",
                "": ""
            },
            {
                "Places": "Al Rumailah",
                "": ""
            },
            {
                "Places": "Al Zahraa",
                "": ""
            },
            {
                "Places": "Bustan",
                "": ""
            },
            {
                "Places": "Corniche",
                "": ""
            },
            {
                "Places": "Downtown",
                "": ""
            },
            {
                "Places": "Emirates City",
                "": ""
            },
            {
                "Places": "Green City",
                "": ""
            },
            {
                "Places": "Hamideeyah",
                "": ""
            },
            {
                "Places": "Hasat al Bidiyah",
                "": ""
            },
            {
                "Places": "Helio",
                "": ""
            },
            {
                "Places": "Industrial Area",
                "": ""
            },
            {
                "Places": "Jurf",
                "": ""
            },
            {
                "Places": "Marina",
                "": ""
            },
            {
                "Places": "Musheirif",
                "": ""
            },
            {
                "Places": "Musheirif Commercial",
                "": ""
            },
            {
                "Places": "Muwayhat",
                "": ""
            },
            {
                "Places": "Nakheel",
                "": ""
            },
            {
                "Places": "Naymiyah",
                "": ""
            },
            {
                "Places": "Private Airfield",
                "": ""
            },
            {
                "Places": "Rashidiya",
                "": ""
            },
            {
                "Places": "Rumaylah",
                "": ""
            },
            {
                "Places": "Sawan",
                "": ""
            },
            {
                "Places": "Tala",
                "": ""
            },
            {
                "Places": "Uptown",
                "": ""
            },
            {
                "Places": "Zahra",
                "": ""
            },
            {
                "Places": "Zawra",
                "": ""
            }
        ];
        $.each(ajman,function (key,value) {
            $('#area').append('<option value="'+value.Places+'">'+value.Places+'</option>');
           // console.log(value.Places)

        });
    }else if(city == 'Ras Al Khaima'){
        var ras = [
            {
                "Places": "Adhan"
            },
            {
                "Places": "Adh Dharbaniyah"
            },
            {
                "Places": "Al Darbijaniyah"
            },
            {
                "Places": "Al Dhait North"
            },
            {
                "Places": "Al Dhait South"
            },
            {
                "Places": "Al Duhaisah"
            },
            {
                "Places": "Al Fahlayn"
            },
            {
                "Places": "Al Fara"
            },
            {
                "Places": "Al Fay"
            },
            {
                "Places": "Al Fulayyah"
            },
            {
                "Places": "Al Ghabah"
            },
            {
                "Places": "Al Ghabam"
            },
            {
                "Places": "Al Ghail"
            },
            {
                "Places": "Al Ghashban"
            },
            {
                "Places": "Al Ghubb"
            },
            {
                "Places": "Al Hamraniyah"
            },
            {
                "Places": "Al Hamra Village"
            },
            {
                "Places": "Al Hayr"
            },
            {
                "Places": "Al Hulaylah"
            },
            {
                "Places": "Al Jaddah"
            },
            {
                "Places": "Al Jazirah al Hamra"
            },
            {
                "Places": "Al Jazirah Aviation Club"
            },
            {
                "Places": "Al Juwais"
            },
            {
                "Places": "Al Khari"
            },
            {
                "Places": "Al Kharran"
            },
            {
                "Places": "Al Khashfah"
            },
            {
                "Places": "Al Mahamm"
            },
            {
                "Places": "Al Mairid"
            },
            {
                "Places": "Al Mamourah"
            },
            {
                "Places": "Al Marjan Island"
            },
            {
                "Places": "Al Masafirah"
            },
            {
                "Places": "Al Mataf"
            },
            {
                "Places": "Al Mu'amurah"
            },
            {
                "Places": "Al Nadiyah"
            },
            {
                "Places": "Al Nakheel"
            },
            {
                "Places": "Al Nudood"
            },
            {
                "Places": "Al Qir"
            },
            {
                "Places": "Al Qurm"
            },
            {
                "Places": "Al Qusaidat"
            },
            {
                "Places": "Al Quwayz"
            },
            {
                "Places": "Al Rams"
            },
            {
                "Places": "Al Sall"
            },
            {
                "Places": "Al Seer"
            },
            {
                "Places": "Al Sharisha"
            },
            {
                "Places": "Al Soor"
            },
            {
                "Places": "Al Turfa"
            },
            {
                "Places": "Al Uraibi"
            },
            {
                "Places": "Al Usayli"
            },
            {
                "Places": "Al Zahra"
            },
            {
                "Places": "An Nakhil"
            },
            {
                "Places": "Ar Rams"
            },
            {
                "Places": "Ash Sha'm"
            },
            {
                "Places": "As Sur"
            },
            {
                "Places": "Athabat"
            },
            {
                "Places": "'Ayim"
            },
            {
                "Places": "Baqal"
            },
            {
                "Places": "Bida"
            },
            {
                "Places": "Bidiyah"
            },
            {
                "Places": "Bulaydah"
            },
            {
                "Places": "Corniche"
            },
            {
                "Places": "Creek"
            },
            {
                "Places": "Dafan Al Khor"
            },
            {
                "Places": "Daftah"
            },
            {
                "Places": "Darah"
            },
            {
                "Places": "Dayah"
            },
            {
                "Places": "Daynah"
            },
            {
                "Places": "Dhad al Arab"
            },
            {
                "Places": "Difan"
            },
            {
                "Places": "Dihan"
            },
            {
                "Places": "Diqdaqah"
            },
            {
                "Places": "Fashrah"
            },
            {
                "Places": "Fa'y"
            },
            {
                "Places": "Fayyad"
            },
            {
                "Places": "Financial City (DIFC)"
            },
            {
                "Places": "Furfar"
            },
            {
                "Places": "Ghadf"
            },
            {
                "Places": "Ghaghah"
            },
            {
                "Places": "Ghalilah"
            },
            {
                "Places": "Ghayl"
            },
            {
                "Places": "Ghubb"
            },
            {
                "Places": "Ghubbat Khawrah"
            },
            {
                "Places": "Ghurah"
            },
            {
                "Places": "Gragrah"
            },
            {
                "Places": "Habhab"
            },
            {
                "Places": "Ham Ham"
            },
            {
                "Places": "Harat Awali"
            },
            {
                "Places": "Hayl"
            },
            {
                "Places": "Hudaybah"
            },
            {
                "Places": "Huwaylat"
            },
            {
                "Places": "Industrial & Technology Park"
            },
            {
                "Places": "Khabakhib"
            },
            {
                "Places": "Kharran"
            },
            {
                "Places": "Khatt"
            },
            {
                "Places": "Khawr Khuwayr"
            },
            {
                "Places": "Khuzam"
            },
            {
                "Places": "Kub"
            },
            {
                "Places": "Liwa Badr"
            },
            {
                "Places": "Ma'ali"
            },
            {
                "Places": "Maghribiyah"
            },
            {
                "Places": "Manqashah"
            },
            {
                "Places": "Marhamid"
            },
            {
                "Places": "Masafi"
            },
            {
                "Places": "Masah"
            },
            {
                "Places": "Mina Al Arab"
            },
            {
                "Places": "Minha"
            },
            {
                "Places": "Mu'ayrid"
            },
            {
                "Places": "Munay'i"
            },
            {
                "Places": "Muraytah"
            },
            {
                "Places": "Old Market"
            },
            {
                "Places": "Qabas"
            },
            {
                "Places": "Qaf'ah"
            },
            {
                "Places": "Qarat ad Dum"
            },
            {
                "Places": "Quar Ah Qahlish"
            },
            {
                "Places": "Qur"
            },
            {
                "Places": "Qurm"
            },
            {
                "Places": "Qusaydat"
            },
            {
                "Places": "Rafaq"
            },
            {
                "Places": "RAK airport"
            },
            {
                "Places": "RAK City"
            },
            {
                "Places": "Ramlah"
            },
            {
                "Places": "Ras al Selaab"
            },
            {
                "Places": "Rima"
            },
            {
                "Places": "Sal Dora"
            },
            {
                "Places": "Salihiyah"
            },
            {
                "Places": "Samarat"
            },
            {
                "Places": "Saraya Islands"
            },
            {
                "Places": "Sayh"
            },
            {
                "Places": "Sayh as Saqlah"
            },
            {
                "Places": "Seih Al Burairat"
            },
            {
                "Places": "Seih Al Ghubb"
            },
            {
                "Places": "Seih Al Harf"
            },
            {
                "Places": "Seih Al Hudaibah"
            },
            {
                "Places": "Seih Al Qusaidat"
            },
            {
                "Places": "Seih Al Uraibi"
            },
            {
                "Places": "Seih Shihyar"
            },
            {
                "Places": "Sha'am"
            },
            {
                "Places": "Shabakah"
            },
            {
                "Places": "Sha'biyat Naslah"
            },
            {
                "Places": "Shah"
            },
            {
                "Places": "Shahawat"
            },
            {
                "Places": "Shamal Haqueel"
            },
            {
                "Places": "Shamal Julphar"
            },
            {
                "Places": "Sharyat"
            },
            {
                "Places": "Shawkah"
            },
            {
                "Places": "Shimal"
            },
            {
                "Places": "Sidroh"
            },
            {
                "Places": "Stan"
            },
            {
                "Places": "Suhaybah"
            },
            {
                "Places": "Uraybi"
            },
            {
                "Places": "Wadi Ammar"
            },
            {
                "Places": "Wadi Sha'am"
            },
            {
                "Places": "Wad Wid"
            },
            {
                "Places": "Waterfront"
            },
            {
                "Places": "Wayb Hawf"
            },
            {
                "Places": "Yasmin Village"
            },
            {
                "Places": "Yinas"
            }
        ];
        $.each(ras,function (key,value) {
            $('#area').append('<option value="'+value.Places+'">'+value.Places+'</option>');
            ///console.log(value.Places)

        });
    }else if(city == 'Dubai'){
        var dubai = [
            {
                "Places": "Abu Hail"
            },
            {
                "Places": "Abu Hayl"
            },
            {
                "Places": "Academic City"
            },
            {
                "Places": "Ad Daghayah"
            },
            {
                "Places": "Airport Free Zone"
            },
            {
                "Places": "Akoya"
            },
            {
                "Places": "Al Aweer"
            },
            {
                "Places": "Al Awir"
            },
            {
                "Places": "Al Bada"
            },
            {
                "Places": "Al Bada'a"
            },
            {
                "Places": "Al Baharnah"
            },
            {
                "Places": "Al Balush"
            },
            {
                "Places": "Al Baraha"
            },
            {
                "Places": "Al Barahah"
            },
            {
                "Places": "Al Barari"
            },
            {
                "Places": "Al Barsha 1"
            },
            {
                "Places": "Al Barsha 2"
            },
            {
                "Places": "Al Barsha 3"
            },
            {
                "Places": "Al Barsha South 1"
            },
            {
                "Places": "Al Barsha South 2"
            },
            {
                "Places": "Al Barsha South 3"
            },
            {
                "Places": "Al Faq"
            },
            {
                "Places": "Al Furjan"
            },
            {
                "Places": "Al Garhoud"
            },
            {
                "Places": "Al Goze Industrial District"
            },
            {
                "Places": "Al Hajarayn"
            },
            {
                "Places": "Al Hamriyah"
            },
            {
                "Places": "Al Hudaba"
            },
            {
                "Places": "Al Hudaiba"
            },
            {
                "Places": "Al Hudaybah"
            },
            {
                "Places": "Al Jadaf"
            },
            {
                "Places": "Al Jafiliya"
            },
            {
                "Places": "Al Jafliya"
            },
            {
                "Places": "Al Karama"
            },
            {
                "Places": "Al Khabasi"
            },
            {
                "Places": "Al Khabeesi"
            },
            {
                "Places": "Al Khail Gate Residential"
            },
            {
                "Places": "Al Khawanij"
            },
            {
                "Places": "Al Kifaf"
            },
            {
                "Places": "Al Lusayli"
            },
            {
                "Places": "Alma 1"
            },
            {
                "Places": "Alma 2"
            },
            {
                "Places": "Al Mahra"
            },
            {
                "Places": "Al Manara"
            },
            {
                "Places": "Al Mankhool"
            },
            {
                "Places": "Al Marqadh"
            },
            {
                "Places": "Al Matinah"
            },
            {
                "Places": "Al Mina"
            },
            {
                "Places": "Al Mizhar"
            },
            {
                "Places": "Al Mizhar 1"
            },
            {
                "Places": "Al Mizhar 2"
            },
            {
                "Places": "Al Muhaisnah"
            },
            {
                "Places": "Al Muraqqabat"
            },
            {
                "Places": "Al Murar"
            },
            {
                "Places": "Al Murar al Jadid"
            },
            {
                "Places": "Al Murar al Qadim"
            },
            {
                "Places": "Al Musalla"
            },
            {
                "Places": "Al Nahda"
            },
            {
                "Places": "Al Nassem"
            },
            {
                "Places": "Al Qawz"
            },
            {
                "Places": "Al Quoz"
            },
            {
                "Places": "Al Quoz 1"
            },
            {
                "Places": "Al Quoz 2"
            },
            {
                "Places": "Al Quoz Industrial Area 1"
            },
            {
                "Places": "Al Quoz Industrial Area 2"
            },
            {
                "Places": "Al Quoz Industrial Area 3"
            },
            {
                "Places": "Al Quoz Industrial Area 4"
            },
            {
                "Places": "Al Qusais 1"
            },
            {
                "Places": "Al Qusais 2"
            },
            {
                "Places": "Al Qusais 3"
            },
            {
                "Places": "Al Qusais Industrial Area 1"
            },
            {
                "Places": "Al Qusais Industrial Area 2"
            },
            {
                "Places": "Al Qusais Industrial Area 5"
            },
            {
                "Places": "Al Qusays"
            },
            {
                "Places": "Al Raffa"
            },
            {
                "Places": "Al Ras"
            },
            {
                "Places": "Al Rashidiya"
            },
            {
                "Places": "Al Reem 1"
            },
            {
                "Places": "Al Reem 2"
            },
            {
                "Places": "Al Reem 3"
            },
            {
                "Places": "Al Rigga"
            },
            {
                "Places": "Al Safa 1"
            },
            {
                "Places": "Al Safa 2"
            },
            {
                "Places": "Al Salam"
            },
            {
                "Places": "Al Satwa"
            },
            {
                "Places": "Al Shindagah"
            },
            {
                "Places": "Al Sufouh 1"
            },
            {
                "Places": "Al Sufouh 2"
            },
            {
                "Places": "Al Twar 1"
            },
            {
                "Places": "Al Twar 2"
            },
            {
                "Places": "Al Twar 3"
            },
            {
                "Places": "Al Usbij"
            },
            {
                "Places": "Alvorada"
            },
            {
                "Places": "Alvorada 1"
            },
            {
                "Places": "Alvorada 2"
            },
            {
                "Places": "Alvorada 3"
            },
            {
                "Places": "Alvorada 4"
            },
            {
                "Places": "Al Waha Villas"
            },
            {
                "Places": "Al Waheda"
            },
            {
                "Places": "Al Warqa'a"
            },
            {
                "Places": "Al Wasl"
            },
            {
                "Places": "Al Wuheida"
            },
            {
                "Places": "Amber Way"
            },
            {
                "Places": "An Nakhl"
            },
            {
                "Places": "Arabella"
            },
            {
                "Places": "Arabian Ranches"
            },
            {
                "Places": "Arabian Ranches 2"
            },
            {
                "Places": "Arjan"
            },
            {
                "Places": "Armada towers"
            },
            {
                "Places": "Ar Ra's"
            },
            {
                "Places": "Ar Rashidiyah"
            },
            {
                "Places": "Ar Rifa'ah"
            },
            {
                "Places": "Ar Riqqah"
            },
            {
                "Places": "Ar Riqqah Gharb"
            },
            {
                "Places": "Ar Riqqah Sharq"
            },
            {
                "Places": "Ash Shamal"
            },
            {
                "Places": "Ash Shindaghah"
            },
            {
                "Places": "As Sabkhah"
            },
            {
                "Places": "As Safa"
            },
            {
                "Places": "As Satwah"
            },
            {
                "Places": "At Tawar"
            },
            {
                "Places": "Ayal Nasir"
            },
            {
                "Places": "Azalea"
            },
            {
                "Places": "Block 12K"
            },
            {
                "Places": "Block 5A"
            },
            {
                "Places": "Block 5B"
            },
            {
                "Places": "Block 5C"
            },
            {
                "Places": "Block 5D"
            },
            {
                "Places": "Block 5E"
            },
            {
                "Places": "Block 5F"
            },
            {
                "Places": "Block 5G"
            },
            {
                "Places": "Block 7C"
            },
            {
                "Places": "Brookfield"
            },
            {
                "Places": "Bu Kadra"
            },
            {
                "Places": "Bur Dubai"
            },
            {
                "Places": "Burj Nahar"
            },
            {
                "Places": "Bur Sa'id"
            },
            {
                "Places": "Business Bay"
            },
            {
                "Places": "Calida Village"
            },
            {
                "Places": "Carmen Village"
            },
            {
                "Places": "Carmen Village North"
            },
            {
                "Places": "Casa Villas"
            },
            {
                "Places": "City of Arabia"
            },
            {
                "Places": "Clubhouse Area"
            },
            {
                "Places": "Corniche Deira"
            },
            {
                "Places": "Culture Village"
            },
            {
                "Places": "Dawwar Burj Nahar"
            },
            {
                "Places": "Dayrah"
            },
            {
                "Places": "Deema 1"
            },
            {
                "Places": "Deema 2"
            },
            {
                "Places": "Deema 3"
            },
            {
                "Places": "Deema 4"
            },
            {
                "Places": "Deira"
            },
            {
                "Places": "Discovery Gardens"
            },
            {
                "Places": "District 5"
            },
            {
                "Places": "District 7"
            },
            {
                "Places": "Downtown Burj Khalifa"
            },
            {
                "Places": "Dubai Aid City"
            },
            {
                "Places": "Dubai Airport Freezone Area"
            },
            {
                "Places": "Dubai Autodrome"
            },
            {
                "Places": "Dubai Design District"
            },
            {
                "Places": "Dubai Festival City"
            },
            {
                "Places": "Dubai Golf City"
            },
            {
                "Places": "Dubai Healthcare City"
            },
            {
                "Places": "Dubai Industrial City"
            },
            {
                "Places": "Dubai International Academic City"
            },
            {
                "Places": "Dubai International Financial Center (DIFC)"
            },
            {
                "Places": "Dubai International Media Production Zone (IMPZ)"
            },
            {
                "Places": "Dubai Internet City"
            },
            {
                "Places": "Dubai Investments Park"
            },
            {
                "Places": "Dubai Land"
            },
            {
                "Places": "Dubai Lifestyle City"
            },
            {
                "Places": "Dubai Marina"
            },
            {
                "Places": "Dubai Media City"
            },
            {
                "Places": "Dubai Media City 2"
            },
            {
                "Places": "Dubai Outlet City"
            },
            {
                "Places": "Dubai Pearl"
            },
            {
                "Places": "Dubai Promenade"
            },
            {
                "Places": "Dubai Residence Complex"
            },
            {
                "Places": "Dubai Silicon Oasis"
            },
            {
                "Places": "Dubai Sports City"
            },
            {
                "Places": "Dubai Studio City"
            },
            {
                "Places": "Dubai Sustainable City"
            },
            {
                "Places": "Dubai Waterfront"
            },
            {
                "Places": "Dubai World Central"
            },
            {
                "Places": "DuBiotech"
            },
            {
                "Places": "Emirates Hill 1"
            },
            {
                "Places": "Emirates Hill 2"
            },
            {
                "Places": "Emirates Hill 3"
            },
            {
                "Places": "Emirates Hills"
            },
            {
                "Places": "Esmeralda Village"
            },
            {
                "Places": "Estella Village"
            },
            {
                "Places": "Falcon City of Wonders 1"
            },
            {
                "Places": "Falcon City of Wonders 2"
            },
            {
                "Places": "Ferij al Muhadham"
            },
            {
                "Places": "Fireside"
            },
            {
                "Places": "Flame Tree Ridge"
            },
            {
                "Places": "Forat"
            },
            {
                "Places": "Ghadeer"
            },
            {
                "Places": "Global Village"
            },
            {
                "Places": "Golf Homes"
            },
            {
                "Places": "Green Community"
            },
            {
                "Places": "Green Community East"
            },
            {
                "Places": "Green Community Motor City"
            },
            {
                "Places": "Green Community West"
            },
            {
                "Places": "Greens"
            },
            {
                "Places": "Hacienda"
            },
            {
                "Places": "Hamriyah"
            },
            {
                "Places": "Hatta"
            },
            {
                "Places": "Hattan"
            },
            {
                "Places": "Hattan 1"
            },
            {
                "Places": "Hattan 2"
            },
            {
                "Places": "Hawr al Anz"
            },
            {
                "Places": "Hayl"
            },
            {
                "Places": "Hayy al Bastakiyah"
            },
            {
                "Places": "Healthcare City"
            },
            {
                "Places": "Hor Al Anz"
            },
            {
                "Places": "Hor Al Anz East"
            },
            {
                "Places": "Hunaywah"
            },
            {
                "Places": "Industrial Area 15"
            },
            {
                "Places": "Industrial Area 17"
            },
            {
                "Places": "International City"
            },
            {
                "Places": "International City 2"
            },
            {
                "Places": "International Media Production Zone (IMPZ)"
            },
            {
                "Places": "Jaddaf"
            },
            {
                "Places": "Jebel Ali Free Zone Area (South)"
            },
            {
                "Places": "Jebel Ali North Free Zone"
            },
            {
                "Places": "Jebel Ali Village"
            },
            {
                "Places": "Jumayra"
            },
            {
                "Places": "Jumeirah"
            },
            {
                "Places": "Jumeirah 1"
            },
            {
                "Places": "Jumeirah 2"
            },
            {
                "Places": "Jumeirah 3"
            },
            {
                "Places": "Jumeirah Beach Residence (JBR)"
            },
            {
                "Places": "Jumeirah Golf Estates"
            },
            {
                "Places": "Jumeirah Heights"
            },
            {
                "Places": "Jumeirah Islands"
            },
            {
                "Places": "Jumeirah Lakes Towers"
            },
            {
                "Places": "Jumeirah Park"
            },
            {
                "Places": "Jumeirah Park Nova"
            },
            {
                "Places": "Jumeirah Village"
            },
            {
                "Places": "Jumeirah Village Circle"
            },
            {
                "Places": "Jumeirah Village Triangle"
            },
            {
                "Places": "Karama"
            },
            {
                "Places": "Knowledge Village"
            },
            {
                "Places": "Kurnish"
            },
            {
                "Places": "La Avenida 1"
            },
            {
                "Places": "La Avenida 2"
            },
            {
                "Places": "La Colleccion"
            },
            {
                "Places": "Lahbab"
            },
            {
                "Places": "Legends"
            },
            {
                "Places": "Lila Village"
            },
            {
                "Places": "Lime Tree Valley"
            },
            {
                "Places": "Liwan"
            },
            {
                "Places": "Liwan Queue Point"
            },
            {
                "Places": "Madinat Badr"
            },
            {
                "Places": "Maeen"
            },
            {
                "Places": "Majan"
            },
            {
                "Places": "Mankhul"
            },
            {
                "Places": "Margham"
            },
            {
                "Places": "Maritime City"
            },
            {
                "Places": "Masfut"
            },
            {
                "Places": "Ma'sharat al Baharnah"
            },
            {
                "Places": "Meadows 1"
            },
            {
                "Places": "Meadows 2"
            },
            {
                "Places": "Meadows 3"
            },
            {
                "Places": "Meadows 4"
            },
            {
                "Places": "Meadows 5"
            },
            {
                "Places": "Meadows 6"
            },
            {
                "Places": "Meadows 7"
            },
            {
                "Places": "Meadows 9"
            },
            {
                "Places": "Meydan"
            },
            {
                "Places": "Meydan City"
            },
            {
                "Places": "Meydan Heights Villas"
            },
            {
                "Places": "Meydan Millenium Estates"
            },
            {
                "Places": "Mintaqat as Suq"
            },
            {
                "Places": "Mintaqat Dubayy at Ta'limiyah"
            },
            {
                "Places": "Mirador"
            },
            {
                "Places": "Mirdif"
            },
            {
                "Places": "Mirrador"
            },
            {
                "Places": "Mirrador La Coleccion 1"
            },
            {
                "Places": "Mirrador La Coleccion 2"
            },
            {
                "Places": "Morella Village"
            },
            {
                "Places": "Motor City"
            },
            {
                "Places": "Mudon"
            },
            {
                "Places": "Muhaisnah 1"
            },
            {
                "Places": "Muhaisnah 2"
            },
            {
                "Places": "Muhaisnah 3"
            },
            {
                "Places": "Muhaisnah 4"
            },
            {
                "Places": "Muhaysnah"
            },
            {
                "Places": "Muhaysnah Shamal"
            },
            {
                "Places": "Murrquab"
            },
            {
                "Places": "Mushrif"
            },
            {
                "Places": "Mushrif Park"
            },
            {
                "Places": "Muteena"
            },
            {
                "Places": "M Z Faraidooni (MZF Al Kabhessi)"
            },
            {
                "Places": "Nad Al Hammar"
            },
            {
                "Places": "Nad Al Sheba"
            },
            {
                "Places": "Nad Al Sheba 2"
            },
            {
                "Places": "Nadd al Humr"
            },
            {
                "Places": "Nadd Al Sheba 3"
            },
            {
                "Places": "Nadd Al Sheba 4"
            },
            {
                "Places": "Nadd ash Shiba"
            },
            {
                "Places": "Nayf"
            },
            {
                "Places": "Novelia Village"
            },
            {
                "Places": "Olive Point"
            },
            {
                "Places": "Orange Grove"
            },
            {
                "Places": "Orange Lake"
            },
            {
                "Places": "Oud Al Muteena"
            },
            {
                "Places": "Oud Metha"
            },
            {
                "Places": "Palma Village"
            },
            {
                "Places": "Palmera"
            },
            {
                "Places": "Palmera 1"
            },
            {
                "Places": "Palmera 2"
            },
            {
                "Places": "Palmera 3"
            },
            {
                "Places": "Palmera 4"
            },
            {
                "Places": "Palm Jebel Ali"
            },
            {
                "Places": "Palm Jumeirah"
            },
            {
                "Places": "Paramount"
            },
            {
                "Places": "Ponderosa"
            },
            {
                "Places": "Port Saeed"
            },
            {
                "Places": "Qaraytaysah"
            },
            {
                "Places": "Qimah"
            },
            {
                "Places": "Queen Meadows"
            },
            {
                "Places": "Rahat"
            },
            {
                "Places": "Ras Al Khor"
            },
            {
                "Places": "Ras Al Khor Industrial Area 1"
            },
            {
                "Places": "Ras Al Khor Industrial Area 2"
            },
            {
                "Places": "Ras Al Khor Industrial Area 3"
            },
            {
                "Places": "Rasha Villas"
            },
            {
                "Places": "Remraam"
            },
            {
                "Places": "Remraam 1"
            },
            {
                "Places": "Remraam 2"
            },
            {
                "Places": "Remraam 3"
            },
            {
                "Places": "Remraam 4"
            },
            {
                "Places": "Riqqah al Butayn"
            },
            {
                "Places": "Riverside"
            },
            {
                "Places": "Rosa Village"
            },
            {
                "Places": "Saheel"
            },
            {
                "Places": "Samara Village"
            },
            {
                "Places": "Sanctuary Falls"
            },
            {
                "Places": "Satwa"
            },
            {
                "Places": "Savannah"
            },
            {
                "Places": "Sharjah Industrial Area 11"
            },
            {
                "Places": "Sienna Lake"
            },
            {
                "Places": "Sienna Views"
            },
            {
                "Places": "Sikkat al Khayl"
            },
            {
                "Places": "Silver Springs"
            },
            {
                "Places": "Sports City"
            },
            {
                "Places": "Springs 1"
            },
            {
                "Places": "Springs 10"
            },
            {
                "Places": "Springs 11"
            },
            {
                "Places": "Springs 12"
            },
            {
                "Places": "Springs 14"
            },
            {
                "Places": "Springs 15"
            },
            {
                "Places": "Springs 2"
            },
            {
                "Places": "Springs 3"
            },
            {
                "Places": "Springs 4"
            },
            {
                "Places": "Springs 5"
            },
            {
                "Places": "Springs 6"
            },
            {
                "Places": "Springs 7"
            },
            {
                "Places": "Springs 8"
            },
            {
                "Places": "Springs 9"
            },
            {
                "Places": "Sufayri"
            },
            {
                "Places": "Tawi as Saygh"
            },
            {
                "Places": "Technology Park"
            },
            {
                "Places": "Techno Park 1 & 2"
            },
            {
                "Places": "Tecom"
            },
            {
                "Places": "Terra Nova"
            },
            {
                "Places": "The Aldea"
            },
            {
                "Places": "The Centro"
            },
            {
                "Places": "The Gardens"
            },
            {
                "Places": "The Lagoons"
            },
            {
                "Places": "The Lakes"
            },
            {
                "Places": "The Layan Community"
            },
            {
                "Places": "The Meadows"
            },
            {
                "Places": "The Meadows 5"
            },
            {
                "Places": "The Meadows 8"
            },
            {
                "Places": "The Plantation Equestrian & Polo Club"
            },
            {
                "Places": "The Springs"
            },
            {
                "Places": "The Sundials"
            },
            {
                "Places": "The Views"
            },
            {
                "Places": "The Villa"
            },
            {
                "Places": "The World Islands"
            },
            {
                "Places": "'Ud al Bayda'"
            },
            {
                "Places": "Um Al Sheif"
            },
            {
                "Places": "Umm Al Sheif"
            },
            {
                "Places": "Umm Hurair 1"
            },
            {
                "Places": "Umm Hurair 2"
            },
            {
                "Places": "Umm Hurayr"
            },
            {
                "Places": "Umm Ramool"
            },
            {
                "Places": "Umm Suqaym"
            },
            {
                "Places": "Umm Suqelm 3"
            },
            {
                "Places": "Umm Suqueim 1"
            },
            {
                "Places": "Umm Suqueim 2"
            },
            {
                "Places": "Umm Suqueim 3"
            },
            {
                "Places": "Um Suqaim Second"
            },
            {
                "Places": "Up Town Motor City"
            },
            {
                "Places": "Urqub Juwayza"
            },
            {
                "Places": "Victory Heights"
            },
            {
                "Places": "Victory Heights 2"
            },
            {
                "Places": "Villa Lantana 1"
            },
            {
                "Places": "Villa Lantana 2"
            },
            {
                "Places": "Wadi Al Safa 4"
            },
            {
                "Places": "Wadi Al Safa 5"
            },
            {
                "Places": "Wadi Al Safa 6"
            },
            {
                "Places": "Wadi Al Safa 7"
            },
            {
                "Places": "Warisan"
            },
            {
                "Places": "Warsan"
            },
            {
                "Places": "Warsan 1"
            },
            {
                "Places": "Warsan 2"
            },
            {
                "Places": "Warsan 3"
            },
            {
                "Places": "Whispering Pines"
            },
            {
                "Places": "Whitefield"
            },
            {
                "Places": "Wildflower"
            },
            {
                "Places": "World Trade Center"
            },
            {
                "Places": "Yasmin Village"
            },
            {
                "Places": "Zabeel 1"
            },
            {
                "Places": "Zabeel 2"
            },
            {
                "Places": "Zaribat Dawiy"
            },
            {
                "Places": "Zulal"
            }
        ];
        $.each(dubai,function (key,value) {
            $('#area').append('<option value="'+value.Places+'">'+value.Places+'</option>');
            //console.log(value.Places)

        });
    }else if(city == 'Sharjah'){
        var sharjah = [
            {
                "Places": "Abu Sangara"
            },
            {
                "Places": "Adh Dhayd"
            },
            {
                "Places": "Al Aber"
            },
            {
                "Places": "Al Ardiyah"
            },
            {
                "Places": "Al Azrra"
            },
            {
                "Places": "Al Butina"
            },
            {
                "Places": "Al Darrare"
            },
            {
                "Places": "Al Dhaid"
            },
            {
                "Places": "Al Fallaj"
            },
            {
                "Places": "Al Fayha"
            },
            {
                "Places": "AL Ghafiya"
            },
            {
                "Places": "Al Ghuhaiba"
            },
            {
                "Places": "Al Ghuwair"
            },
            {
                "Places": "Al Goaz"
            },
            {
                "Places": "Al Hamriyah"
            },
            {
                "Places": "Al Hawayah"
            },
            {
                "Places": "Al Hayrah"
            },
            {
                "Places": "Al Hazana"
            },
            {
                "Places": "Al Heera Suburb"
            },
            {
                "Places": "Al Hutain"
            },
            {
                "Places": "Al Jazzat"
            },
            {
                "Places": "Al Khabba"
            },
            {
                "Places": "AL Khaildia Suburb"
            },
            {
                "Places": "Al Khaldeia"
            },
            {
                "Places": "Al Khan"
            },
            {
                "Places": "Al Khouzamiya"
            },
            {
                "Places": "Al Madam"
            },
            {
                "Places": "Al Mahatah"
            },
            {
                "Places": "Al Majaz"
            },
            {
                "Places": "Al Mamzar"
            },
            {
                "Places": "Al Mamzer"
            },
            {
                "Places": "Al Manakh"
            },
            {
                "Places": "Al Marijah"
            },
            {
                "Places": "Al Mirgab"
            },
            {
                "Places": "Al Mudaifi"
            },
            {
                "Places": "Al Mussalla"
            },
            {
                "Places": "Al Nabba"
            },
            {
                "Places": "Al Nahda 1"
            },
            {
                "Places": "Al Nahda 2"
            },
            {
                "Places": "Al Nasserya"
            },
            {
                "Places": "Al nekhailat"
            },
            {
                "Places": "Al Nud"
            },
            {
                "Places": "Al Qadsia"
            },
            {
                "Places": "Al Qasba"
            },
            {
                "Places": "Al Qasemiya"
            },
            {
                "Places": "Al Qusais Industrial Area 3"
            },
            {
                "Places": "Al Qusais Industrial Area 4"
            },
            {
                "Places": "Al Ramaqia"
            },
            {
                "Places": "Al Ramla"
            },
            {
                "Places": "Al Ramla East"
            },
            {
                "Places": "AL Ramla West"
            },
            {
                "Places": "Al Ramtha"
            },
            {
                "Places": "Al Rifa"
            },
            {
                "Places": "Al Rifah"
            },
            {
                "Places": "Al Riqa Suburb"
            },
            {
                "Places": "Al Shahab"
            },
            {
                "Places": "Al Sharq"
            },
            {
                "Places": "Al Shuwaiheen"
            },
            {
                "Places": "Al Subaikhi"
            },
            {
                "Places": "Al Swehat"
            },
            {
                "Places": "Al Talae"
            },
            {
                "Places": "Al Wahda"
            },
            {
                "Places": "Al Yarmook"
            },
            {
                "Places": "an-Nahwa"
            },
            {
                "Places": "Ar Rufaysah"
            },
            {
                "Places": "Ash Shu'ayb"
            },
            {
                "Places": "Bu Danig"
            },
            {
                "Places": "Bu Tina"
            },
            {
                "Places": "Corniche Al Buhaira"
            },
            {
                "Places": "Eliash"
            },
            {
                "Places": "Etisalat"
            },
            {
                "Places": "Ghunah"
            },
            {
                "Places": "Hajar"
            },
            {
                "Places": "Hamriya"
            },
            {
                "Places": "Hamriyah Free Zone"
            },
            {
                "Places": "Hiyawah"
            },
            {
                "Places": "Hizayib az Zanah"
            },
            {
                "Places": "Industrial Area 13"
            },
            {
                "Places": "Khawr Fakkan"
            },
            {
                "Places": "Khor Fakkan"
            },
            {
                "Places": "Layyah"
            },
            {
                "Places": "Lulayyah"
            },
            {
                "Places": "Madha"
            },
            {
                "Places": "Maysaloon"
            },
            {
                "Places": "Muwafjah"
            },
            {
                "Places": "Nahwa"
            },
            {
                "Places": "Nazwa"
            },
            {
                "Places": "Nedaifi"
            },
            {
                "Places": "New Shwaib"
            },
            {
                "Places": "Private airfield"
            },
            {
                "Places": "Rafa'"
            },
            {
                "Places": "Rolla Area"
            },
            {
                "Places": "Rollah Square"
            },
            {
                "Places": "Sa'd"
            },
            {
                "Places": "Sahanah"
            },
            {
                "Places": "Samnan"
            },
            {
                "Places": "Saruj"
            },
            {
                "Places": "Shargan"
            },
            {
                "Places": "Sharjah"
            },
            {
                "Places": "Sharjah Airport Free Zone (SAIF)"
            },
            {
                "Places": "Sharjah Industrial Area 1"
            },
            {
                "Places": "Sharjah Industrial Area 10"
            },
            {
                "Places": "Sharjah Industrial Area 12"
            },
            {
                "Places": "Sharjah Industrial Area 2"
            },
            {
                "Places": "Sharjah Industrial Area 3"
            },
            {
                "Places": "Sharjah Industrial Area 4"
            },
            {
                "Places": "Sharjah Industrial Area 5"
            },
            {
                "Places": "Sharjah Industrial Area 6"
            },
            {
                "Places": "Sharjah Industrial Area 7"
            },
            {
                "Places": "Sharjah Industrial Area 8"
            },
            {
                "Places": "Sharjah Industrial Area 9"
            },
            {
                "Places": "Shis"
            },
            {
                "Places": "Shwaib"
            },
            {
                "Places": "Turrfana"
            },
            {
                "Places": "Umm Khanoor"
            },
            {
                "Places": "Um Tarrafa"
            },
            {
                "Places": "Wadi Shi"
            },
            {
                "Places": "Wasit Suburb"
            },
            {
                "Places": "Zubarah"
            }
        ];
        $.each(sharjah,function (key,value) {
            $('#area').append('<option value="'+value.Places+'">'+value.Places+'</option>');
          //  console.log(value.Places)

        });
    }else if(city == 'Abu Dhabi'){
        var abu = [
            {
                "Places": "Abu Dhabi Airport",
                "": ""
            },
            {
                "Places": "Abu Dhabi Gate City",
                "": ""
            },
            {
                "Places": "Al Ain",
                "": ""
            },
            {
                "Places": "Al Aman",
                "": ""
            },
            {
                "Places": "Al Atir",
                "": ""
            },
            {
                "Places": "Al Ayn",
                "": ""
            },
            {
                "Places": "Al Bahia",
                "": ""
            },
            {
                "Places": "Al Baladiyah",
                "": ""
            },
            {
                "Places": "Al Bateen",
                "": ""
            },
            {
                "Places": "Al Dhafrah",
                "": ""
            },
            {
                "Places": "Al Falah City",
                "": ""
            },
            {
                "Places": "Al Falah New Community",
                "": ""
            },
            {
                "Places": "Al Ghadeer",
                "": ""
            },
            {
                "Places": "Al Hadhi",
                "": ""
            },
            {
                "Places": "Al Hayer",
                "": ""
            },
            {
                "Places": "Al Hisn",
                "": ""
            },
            {
                "Places": "Al Hosn",
                "": ""
            },
            {
                "Places": "Al Hudayriat Island",
                "": ""
            },
            {
                "Places": "Al Idd",
                "": ""
            },
            {
                "Places": "Al Ittihad",
                "": ""
            },
            {
                "Places": "Al Jahr",
                "": ""
            },
            {
                "Places": "Al Jami al Kabir",
                "": ""
            },
            {
                "Places": "Al Karamah",
                "": ""
            },
            {
                "Places": "Al Khabb",
                "": ""
            },
            {
                "Places": "Al Khaleej Al Arabi",
                "": ""
            },
            {
                "Places": "Al Khalidiya",
                "": ""
            },
            {
                "Places": "Al Khalidiyah",
                "": ""
            },
            {
                "Places": "Al Khatim",
                "": ""
            },
            {
                "Places": "Al Khazna",
                "": ""
            },
            {
                "Places": "Al Khaznah",
                "": ""
            },
            {
                "Places": "Al Khis",
                "": ""
            },
            {
                "Places": "Al Khubayrah",
                "": ""
            },
            {
                "Places": "Al Khubeirah",
                "": ""
            },
            {
                "Places": "Al Mafraq",
                "": ""
            },
            {
                "Places": "Al Manhal",
                "": ""
            },
            {
                "Places": "Al Maqta",
                "": ""
            },
            {
                "Places": "Al Marfa",
                "": ""
            },
            {
                "Places": "Al Mariah United Group",
                "": ""
            },
            {
                "Places": "Al Mariyah",
                "": ""
            },
            {
                "Places": "Al Mariyah al Gharbiyah",
                "": ""
            },
            {
                "Places": "Al Markaziyah",
                "": ""
            },
            {
                "Places": "Al Mashrub",
                "": ""
            },
            {
                "Places": "Al Mina",
                "": ""
            },
            {
                "Places": "Al Mirfa",
                "": ""
            },
            {
                "Places": "Al Mughayra'",
                "": ""
            },
            {
                "Places": "Al Muqattarah",
                "": ""
            },
            {
                "Places": "Al Muroor",
                "": ""
            },
            {
                "Places": "Al Murur",
                "": ""
            },
            {
                "Places": "Al Musalla",
                "": ""
            },
            {
                "Places": "Al Mushrif",
                "": ""
            },
            {
                "Places": "Al Mu'tarad",
                "": ""
            },
            {
                "Places": "Al Muwayqi'i",
                "": ""
            },
            {
                "Places": "Al Muzun",
                "": ""
            },
            {
                "Places": "Al Nahda",
                "": ""
            },
            {
                "Places": "Al Nahyan",
                "": ""
            },
            {
                "Places": "Al Najda",
                "": ""
            },
            {
                "Places": "Al Qaia",
                "": ""
            },
            {
                "Places": "Al Qimi",
                "": ""
            },
            {
                "Places": "Al Qurm",
                "": ""
            },
            {
                "Places": "Al Raha Beach",
                "": ""
            },
            {
                "Places": "Al Raha Corniche",
                "": ""
            },
            {
                "Places": "Al Raha Gardens",
                "": ""
            },
            {
                "Places": "Al Raha Golf Gardens",
                "": ""
            },
            {
                "Places": "Al Rahba",
                "": ""
            },
            {
                "Places": "Al Ras Al Akhdar",
                "": ""
            },
            {
                "Places": "Al Rawdah",
                "": ""
            },
            {
                "Places": "Al Reef",
                "": ""
            },
            {
                "Places": "Al Reem Island",
                "": ""
            },
            {
                "Places": "Al Rowdah",
                "": ""
            },
            {
                "Places": "Al Ruwais",
                "": ""
            },
            {
                "Places": "Al Samha",
                "": ""
            },
            {
                "Places": "Al Shahama",
                "": ""
            },
            {
                "Places": "Al Shamkha",
                "": ""
            },
            {
                "Places": "Al Sowwah",
                "": ""
            },
            {
                "Places": "Al Udayd",
                "": ""
            },
            {
                "Places": "Al Wahda",
                "": ""
            },
            {
                "Places": "Al Wahdah",
                "": ""
            },
            {
                "Places": "Al Wathba",
                "": ""
            },
            {
                "Places": "Al Wathbah",
                "": ""
            },
            {
                "Places": "Al Zaab",
                "": ""
            },
            {
                "Places": "An Nadi as Siyahi",
                "": ""
            },
            {
                "Places": "An Nashshash",
                "": ""
            },
            {
                "Places": "Aqbiyah",
                "": ""
            },
            {
                "Places": "Aradah",
                "": ""
            },
            {
                "Places": "Ar Ra's al Akhdar",
                "": ""
            },
            {
                "Places": "Ar Rawdah",
                "": ""
            },
            {
                "Places": "Ar Rihan",
                "": ""
            },
            {
                "Places": "Ar Ruways",
                "": ""
            },
            {
                "Places": "Ash Shahamah",
                "": ""
            },
            {
                "Places": "Ash Shibhanah",
                "": ""
            },
            {
                "Places": "As Sad",
                "": ""
            },
            {
                "Places": "As Slabeikh",
                "": ""
            },
            {
                "Places": "As Sulaymat",
                "": ""
            },
            {
                "Places": "Attab",
                "": ""
            },
            {
                "Places": "Ayn al Faydah",
                "": ""
            },
            {
                "Places": "Az Za'ab",
                "": ""
            },
            {
                "Places": "Az Zafrah",
                "": ""
            },
            {
                "Places": "Az Zahra",
                "": ""
            },
            {
                "Places": "Badiyah",
                "": ""
            },
            {
                "Places": "Baniyas",
                "": ""
            },
            {
                "Places": "Batin",
                "": ""
            },
            {
                "Places": "Bin Ahmad",
                "": ""
            },
            {
                "Places": "Bu Hasa",
                "": ""
            },
            {
                "Places": "Bu Lifiyat",
                "": ""
            },
            {
                "Places": "Bu Rays",
                "": ""
            },
            {
                "Places": "Capital District",
                "": ""
            },
            {
                "Places": "Corniche",
                "": ""
            },
            {
                "Places": "Dahin",
                "": ""
            },
            {
                "Places": "Danet",
                "": ""
            },
            {
                "Places": "Da'sah",
                "": ""
            },
            {
                "Places": "Downtown",
                "": ""
            },
            {
                "Places": "Fariq Tarif",
                "": ""
            },
            {
                "Places": "Ghantoot",
                "": ""
            },
            {
                "Places": "Ghurbah",
                "": ""
            },
            {
                "Places": "Golf Gardens",
                "": ""
            },
            {
                "Places": "Grand Mosque District",
                "": ""
            },
            {
                "Places": "Habshan",
                "": ""
            },
            {
                "Places": "Hadbat az Za'faranah",
                "": ""
            },
            {
                "Places": "Hafif",
                "": ""
            },
            {
                "Places": "Hamarur",
                "": ""
            },
            {
                "Places": "Hameem",
                "": ""
            },
            {
                "Places": "Hamim",
                "": ""
            },
            {
                "Places": "Hilli",
                "": ""
            },
            {
                "Places": "Humar",
                "": ""
            },
            {
                "Places": "Huwaylah",
                "": ""
            },
            {
                "Places": "Huwaytayn",
                "": ""
            },
            {
                "Places": "Hydra Village",
                "": ""
            },
            {
                "Places": "Istayhah",
                "": ""
            },
            {
                "Places": "Jayf",
                "": ""
            },
            {
                "Places": "Jebel Dhanna",
                "": ""
            },
            {
                "Places": "Jurayrah",
                "": ""
            },
            {
                "Places": "Kayyah",
                "": ""
            },
            {
                "Places": "Khalifa City B",
                "": ""
            },
            {
                "Places": "Khalifa Street",
                "": ""
            },
            {
                "Places": "Khannur",
                "": ""
            },
            {
                "Places": "Liwa",
                "": ""
            },
            {
                "Places": "Lulu Island",
                "": ""
            },
            {
                "Places": "Madinat ad Dubbat",
                "": ""
            },
            {
                "Places": "Madinat an Nahdah",
                "": ""
            },
            {
                "Places": "Madinat Khalifah A",
                "": ""
            },
            {
                "Places": "Madinat Khalifah B",
                "": ""
            },
            {
                "Places": "Madinat Zayed",
                "": ""
            },
            {
                "Places": "Madinat Zayid",
                "": ""
            },
            {
                "Places": "Mahdar Bin 'Usayyan",
                "": ""
            },
            {
                "Places": "Majra al Ghaf",
                "": ""
            },
            {
                "Places": "Marawwah",
                "": ""
            },
            {
                "Places": "Marina Village",
                "": ""
            },
            {
                "Places": "Masdar City",
                "": ""
            },
            {
                "Places": "Mas'udi",
                "": ""
            },
            {
                "Places": "Mawsil",
                "": ""
            },
            {
                "Places": "Mazyad",
                "": ""
            },
            {
                "Places": "Milqatah",
                "": ""
            },
            {
                "Places": "Mintaqah Bayn al Jisrayn",
                "": ""
            },
            {
                "Places": "Mintaqat al Matar",
                "": ""
            },
            {
                "Places": "Mohamed Bin Zayed City",
                "": ""
            },
            {
                "Places": "Mujib",
                "": ""
            },
            {
                "Places": "Mundafinah",
                "": ""
            },
            {
                "Places": "Muroor Area",
                "": ""
            },
            {
                "Places": "Mussafah",
                "": ""
            },
            {
                "Places": "Muzayri'",
                "": ""
            },
            {
                "Places": "Nafir",
                "": ""
            },
            {
                "Places": "Nahel",
                "": ""
            },
            {
                "Places": "Naqrah",
                "": ""
            },
            {
                "Places": "NPCC, Mussafa, Abu DHabi",
                "": ""
            },
            {
                "Places": "Nuqayrah",
                "": ""
            },
            {
                "Places": "Nurai Island",
                "": ""
            },
            {
                "Places": "Police Officers City",
                "": ""
            },
            {
                "Places": "Qaryat at Turath",
                "": ""
            },
            {
                "Places": "Qasr al Bahr",
                "": ""
            },
            {
                "Places": "Qasr ash Shati'",
                "": ""
            },
            {
                "Places": "Qasr El Bahr",
                "": ""
            },
            {
                "Places": "Qasr El Shatie",
                "": ""
            },
            {
                "Places": "Qattarah",
                "": ""
            },
            {
                "Places": "Qu'aysah",
                "": ""
            },
            {
                "Places": "Qurmidah",
                "": ""
            },
            {
                "Places": "Qutuf",
                "": ""
            },
            {
                "Places": "Ras Khumais",
                "": ""
            },
            {
                "Places": "Rowdat Al Reef Palace",
                "": ""
            },
            {
                "Places": "Saadiyat Island",
                "": ""
            },
            {
                "Places": "Sabkhah",
                "": ""
            },
            {
                "Places": "Sas Al Nakheel",
                "": ""
            },
            {
                "Places": "Sas an Nakhl",
                "": ""
            },
            {
                "Places": "Shah",
                "": ""
            },
            {
                "Places": "Shati' ar Rahah",
                "": ""
            },
            {
                "Places": "Sikkat al Khayl",
                "": ""
            },
            {
                "Places": "Suwayhan",
                "": ""
            },
            {
                "Places": "Sweihan",
                "": ""
            },
            {
                "Places": "Taraq",
                "": ""
            },
            {
                "Places": "Tarif",
                "": ""
            },
            {
                "Places": "Tharwaniyah",
                "": ""
            },
            {
                "Places": "Tourist Club Area",
                "": ""
            },
            {
                "Places": "Umm al Qurayn",
                "": ""
            },
            {
                "Places": "Wadhil",
                "": ""
            },
            {
                "Places": "Wafd",
                "": ""
            },
            {
                "Places": "Yafur",
                "": ""
            },
            {
                "Places": "Yas Island",
                "": ""
            },
            {
                "Places": "Yas Marina F1 Circuit",
                "": ""
            },
            {
                "Places": "Zafir",
                "": ""
            },
            {
                "Places": "Zayed Military City",
                "": ""
            },
            {
                "Places": "Zuwayhir",
                "": ""
            }
        ];
        $.each(abu,function (key,value) {
            $('#area').append('<option value="'+value.Places+'">'+value.Places+'</option>');
          //  console.log(value.Places)

        });
    }else if(city == 'Umm al Qwain'){
        var umm = [
            {
                "Places": "Al Abraq"
            },
            {
                "Places": "Al Adhib"
            },
            {
                "Places": "Al Dar Al Baida - A"
            },
            {
                "Places": "Al Dar Al Baida - B"
            },
            {
                "Places": "Al Haditha"
            },
            {
                "Places": "Al Hamrah - B"
            },
            {
                "Places": "Al Hamrah - D"
            },
            {
                "Places": "Al Hawiyah"
            },
            {
                "Places": "Al Hazaywah"
            },
            {
                "Places": "Al Humrah - A"
            },
            {
                "Places": "Al Khor"
            },
            {
                "Places": "Al Labsah"
            },
            {
                "Places": "Al Limghadar"
            },
            {
                "Places": "Al Madar"
            },
            {
                "Places": "Al Maidan"
            },
            {
                "Places": "Al Quram"
            },
            {
                "Places": "Al Ra'as - A"
            },
            {
                "Places": "Al Ra'as - B"
            },
            {
                "Places": "Al Ra'as - C"
            },
            {
                "Places": "Al Ra'as - D"
            },
            {
                "Places": "Al Raudah"
            },
            {
                "Places": "Al Riqqah"
            },
            {
                "Places": "Al Salam City"
            },
            {
                "Places": "Ar Ra'fah"
            },
            {
                "Places": "Ar Ramlah"
            },
            {
                "Places": "Ar Rashidiyah"
            },
            {
                "Places": "As Salamah"
            },
            {
                "Places": "As Surrah"
            },
            {
                "Places": "Barracuda"
            },
            {
                "Places": "Barracuda Beach Resort"
            },
            {
                "Places": "Biyatah"
            },
            {
                "Places": "Defence Camp"
            },
            {
                "Places": "Diwwan Al Amiri"
            },
            {
                "Places": "Emirates Modern Industrial"
            },
            {
                "Places": "Emirates Motorplex"
            },
            {
                "Places": "Environmental Marine Research Center"
            },
            {
                "Places": "Falaj al Moalla"
            },
            {
                "Places": "Falaj al Mu'alla"
            },
            {
                "Places": "Green Belt"
            },
            {
                "Places": "Industrial Area A"
            },
            {
                "Places": "Industrial Area B"
            },
            {
                "Places": "Industrial Area C"
            },
            {
                "Places": "Kabir"
            },
            {
                "Places": "Lazimah"
            },
            {
                "Places": "Mintaqah al Hadithah"
            },
            {
                "Places": "Mintaqat ad Dar al Bayda A"
            },
            {
                "Places": "Mintaqat ad Dar al Bayda B"
            },
            {
                "Places": "Mintaqat al 'Ahd"
            },
            {
                "Places": "Mintaqat al Hawiyah"
            },
            {
                "Places": "Mintaqat al Humrah A"
            },
            {
                "Places": "Mintaqat al Humrah B"
            },
            {
                "Places": "Mintaqat al Humrah D"
            },
            {
                "Places": "Mintaqat al Humrah J"
            },
            {
                "Places": "Mintaqat al Khawr"
            },
            {
                "Places": "Mintaqat al Madinah al Qadimah"
            },
            {
                "Places": "Mintaqat al Maydan"
            },
            {
                "Places": "Mintaqat ar Ra's A"
            },
            {
                "Places": "Mintaqat ar Ra's B"
            },
            {
                "Places": "Mintaqat ar Ra's D"
            },
            {
                "Places": "Mintaqat ar Ra's J"
            },
            {
                "Places": "Mintaqat ar Rawdah"
            },
            {
                "Places": "Mintaqat ar Riqqah"
            },
            {
                "Places": "Mintaqat Limghadar"
            },
            {
                "Places": "Mintaqat Umm al Qaywayn at Tibbiyah"
            },
            {
                "Places": "Muhadhdhib"
            },
            {
                "Places": "Old Town"
            },
            {
                "Places": "The settlement of fishermen"
            },
            {
                "Places": "Umm Al Quwain"
            },
            {
                "Places": "Umm Al Quwain Aviation & Parachute Club"
            },
            {
                "Places": "Umm Al Quwain Hunting & Shooting Club"
            },
            {
                "Places": "Umm Al Quwain Marina"
            },
            {
                "Places": "Uwaynat"
            }
        ];
        $.each(umm,function (key,value) {
            $('#area').append('<option value="'+value.Places+'">'+value.Places+'</option>');
         //   console.log(value.Places)

        });
    }else if(city == 'Fujairah'){
        var fuj = [
            {
                "Places": "Abadilah"
            },
            {
                "Places": "Afarah"
            },
            {
                "Places": "Akamiyah"
            },
            {
                "Places": "Al Aqah"
            },
            {
                "Places": "Al Awdah"
            },
            {
                "Places": "Al Ayn al Ghumur"
            },
            {
                "Places": "Al Fuqait"
            },
            {
                "Places": "Al Ghurfa"
            },
            {
                "Places": "Al Ghurfah"
            },
            {
                "Places": "Al Gissemari"
            },
            {
                "Places": "Al Halah"
            },
            {
                "Places": "Al Hayl"
            },
            {
                "Places": "Al Hinya"
            },
            {
                "Places": "Al Kubus"
            },
            {
                "Places": "Al Manamah"
            },
            {
                "Places": "Al Qurayyah"
            },
            {
                "Places": "Al Uyaynah"
            },
            {
                "Places": "Aqqah"
            },
            {
                "Places": "Ar Rul"
            },
            {
                "Places": "Asamah"
            },
            {
                "Places": "Ashashah"
            },
            {
                "Places": "Badiyah"
            },
            {
                "Places": "Bitnah"
            },
            {
                "Places": "Corniche"
            },
            {
                "Places": "Dab'ah"
            },
            {
                "Places": "Dadna"
            },
            {
                "Places": "Dahir"
            },
            {
                "Places": "Diba"
            },
            {
                "Places": "Dibba"
            },
            {
                "Places": "Dub"
            },
            {
                "Places": "Faqi"
            },
            {
                "Places": "Far'ah"
            },
            {
                "Places": "Friday Market"
            },
            {
                "Places": "Fujairah"
            },
            {
                "Places": "Ghamarah"
            },
            {
                "Places": "Ghayl"
            },
            {
                "Places": "Ghurfah"
            },
            {
                "Places": "Girath"
            },
            {
                "Places": "Haqil"
            },
            {
                "Places": "Harat Zutut"
            },
            {
                "Places": "Harrah"
            },
            {
                "Places": "Hatiyah"
            },
            {
                "Places": "Hayat"
            },
            {
                "Places": "Jareef"
            },
            {
                "Places": "Kalba"
            },
            {
                "Places": "Khalba"
            },
            {
                "Places": "Khawr Kalba"
            },
            {
                "Places": "Khor Khalba"
            },
            {
                "Places": "Khulaybiyah"
            },
            {
                "Places": "Mawrid"
            },
            {
                "Places": "Maydaq"
            },
            {
                "Places": "Merbah"
            },
            {
                "Places": "Minazif"
            },
            {
                "Places": "Mukhtaraqah"
            },
            {
                "Places": "Murbad"
            },
            {
                "Places": "Murbah"
            },
            {
                "Places": "Murrah"
            },
            {
                "Places": "Mu'taridah"
            },
            {
                "Places": "Nuhayy"
            },
            {
                "Places": "Qidfa"
            },
            {
                "Places": "Ras Dibba"
            },
            {
                "Places": "Riyamah"
            },
            {
                "Places": "Rughaylat"
            },
            {
                "Places": "Rul Dadna"
            },
            {
                "Places": "Safad"
            },
            {
                "Places": "Sa'if"
            },
            {
                "Places": "Saqamqam"
            },
            {
                "Places": "Sharm"
            },
            {
                "Places": "Shawiyah"
            },
            {
                "Places": "Sinnah"
            },
            {
                "Places": "Sram"
            },
            {
                "Places": "Sumbrair"
            },
            {
                "Places": "Sur"
            },
            {
                "Places": "Tarif Kalba"
            },
            {
                "Places": "Tariqat Ja'd"
            },
            {
                "Places": "Tawian"
            },
            {
                "Places": "Tawi Siji"
            },
            {
                "Places": "Tayyibah"
            },
            {
                "Places": "Theeb"
            },
            {
                "Places": "Thoban"
            },
            {
                "Places": "'Uqayr"
            },
            {
                "Places": "Wa'bayn"
            },
            {
                "Places": "Wahala"
            },
            {
                "Places": "Wamm"
            },
            {
                "Places": "Yalah"
            },
            {
                "Places": "Zanhah"
            },
            {
                "Places": "Zikt"
            }
        ];
        $.each(fuj,function (key,value) {
            $('#area').append('<option value="'+value.Places+'">'+value.Places+'</option>');
           // console.log(value.Places)
//
        });
    }


}

function cityGetter() {
    $.get('http://mytutor.ae/mobile/public/api/getAllCities',function (data) {
        // console.log(data);
        $('#cities option:not(:first)').remove();
        $.each(data,function (key,value) {
            $('#cities').append('<option value="'+value.id+'">'+value.city+'</option>');
        });

    });
}


