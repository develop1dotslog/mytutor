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

$.get('http://dotslog.com/talent/public/api/dataSearch',function (data) {

    // $.each(data.cities,function (key,value) {
    //     $('.city').append('<option value="'+value.id+'">'+value.city_name+'</option>');
    // });


    // $.each(data.subjects,function (key,value) {
    //     $('.subject').append('<option value="'+value.id+'">'+value.subject_name+'</option>');
    // });
    //
    // $.each(data.category,function (key,value) {
    //     $('.category').append('<option value="'+value.id+'">'+value.category_name+'</option>');
    // });

});

$('.search_btn').on('click',function () {

    var user_type = $('.user_type').val();
    //    var subject = $('.subject').val();
    //    var category =  $('.category').val();
    var city =  $('.city').val();

    window.localStorage.setItem('user_type',user_type);
    window.localStorage.setItem('city',city);
    //  window.localStorage.setItem('category',category);
    //  window.localStorage.setItem('subject',subject);
    myApp.closeModal();
    mainView.router.loadPage('search-result.html');
});

$$('.popup-search').on('popup:open', function () {

    $.get('http://dotslog.com/talent/public/api/dataSearch',function (data) {

        // $.each(data.cities,function (key,value) {
        //     $('.city').append('<option value="'+value.id+'">'+value.city_name+'</option>');
        // });


        // $.each(data.subjects,function (key,value) {
        //     $('.subject').append('<option value="'+value.id+'">'+value.subject_name+'</option>');
        // });
        //
        // $.each(data.category,function (key,value) {
        //     $('.category').append('<option value="'+value.id+'">'+value.category_name+'</option>');
        // });

    });

    $('.search_btn').on('click',function () {

        var user_type = $('.user_type').val();
        //    var subject = $('.subject').val();
        //    var category =  $('.category').val();
        var city =  $('.city').val();

        window.localStorage.setItem('user_type',user_type);
        window.localStorage.setItem('city',city);
        //  window.localStorage.setItem('category',category);
        //  window.localStorage.setItem('subject',subject);
        myApp.closeModal();
        mainView.router.loadPage('search-result.html');
    });
});


var user_type =  window.localStorage.getItem('user_type');
if(user_type == 1){
    $$('#membership').hide();
}

var token = window.localStorage.getItem('token');
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
        $.get('http://dotslog.com/talent/public/api/checkForExpiry?token='+token,function (data) {
            if(data == 'Account Expired'){
                myApp.alert(data,'Alert!');
            }
        });

    }

    if (page.name === 'contact') {

        $('#send_btn').on('click',function(){
            var name = $('#name').val();
            var email = $('#email').val();
            var contact_no = $('#contact_no').val();
            var message = $('#message').val();

            $.post('http://dotslog.com/talent/public/api/contact',{name:name,email:email,contact_no:contact_no,message:message},function (data) {
                myApp.alert("Message Sent!! You will be contacted soon",'Alert!');
            })
        });


    }

    if (page.name === 'search-result') {


        var user_type =  window.localStorage.getItem('user_type');
        //  var subject = window.localStorage.getItem('subject');
        //   var category =   window.localStorage.getItem('category');
        var city =   window.localStorage.getItem('city');
        var name = "";
        myApp.showPreloader();
        $.post('http://dotslog.com/talent/public/api/search',{user_type:user_type,city:city},function (data) {

            console.log(data);
            window.localStorage.removeItem('user_type');
            //  window.localStorage.removeItem('subject');
            //    window.localStorage.removeItem('category');
            window.localStorage.removeItem('city');
            myApp.hidePreloader();

            if(data.flag == 0){
                $('#no_result').show();
            }

            $.each(data.user,function (key,value) {

                if(user_type == 1){

                    name = value.f_name+' '+value.l_name;

                }else if(user_type == 2){
                    name = value.f_name+' '+value.l_name;
                }else if(user_type == 3){
                    name = value.institute;
                }

                $('.content-block').append('<div class="thumbnail">' +
                    '<div class="data-table data-table-init card"><div class="card-content">' +
                    '<img src="img/avatar/student.png" class="responsive" /><table>' +
                    '<tbody><tr><th style="border-top: 1px solid #e0e0e0;">Name</th>' +
                    '<td id="name">'+name+'</td></tr><tr><th>City</th><td>'+value.city_name+'</td></tr>' +
                    '<tr><th>Area</th><td>'+value.area_name+'</td></tr>' +
                    '</tbody></table>' +
                    '<br/><div class="buttons"><a href="#" data-id="'+value.id+'" onclick="getID(this)"  class="button button-fill button-raised">View Ad</a>' +
                    '<a href="student-profile.html"  data-id="'+value.id+'" onclick="getID(this)" class="profile button button-fill button-raised">View Profile</a>' +
                    '<a href="message.html" data-id="'+value.id+'" onclick="getID(this)" class="button button-fill button-raised">Send Message</a></div>' +
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

        // $.get('http://dotslog.com/talent/public/api/getAllCities',function (data) {
        //     //console.log(data);
        //     $.each(data,function (key,value) {
        //         $('.city').append('<option value="'+value.id+'">'+value.city_name+'</option>');
        //     });
        // });

        $.get('http://dotslog.com/talent/public/api/getAllLevels',function (data) {
            // console.log(data);
            $.each(data,function (key,value) {
                $('.level').append('<option value="'+value.id+'">'+value.level_name+'</option>');
            });
        });

        $.get('http://dotslog.com/talent/public/api/getAllSubjects',function (data) {
            // console.log(data);
            $.each(data,function (key,value) {
                $('.subject').append('<option value="'+value.id+'">'+value.subject_name+'</option>');
            });
        });

        $.get('http://dotslog.com/talent/public/api/getAllCategory',function (data) {
            // console.log(data);
            $.each(data,function (key,value) {
                $('.category').append('<option value="'+value.id+'">'+value.category_name+'</option>');
            });
        });

        $.get('http://dotslog.com/talent/public/api/getAllArea',function (data) {
            // console.log(data);
            $.each(data,function (key,value) {
                $('.area').append('<option value="'+value.id+'">'+value.area_name+'</option>');
            });
        });

        $('#signup_btn').on('click',function () {
            event.preventDefault();
            var f_name = $('#f_name').val();
            var l_name = $('#l_name').val();
            var address = $('#address').val();
            var city_id = $('#city_id').val();
            var area_id = $('#area_id').val();
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
                $.post('http://dotslog.com/talent/public/api/postSignup',{gender:gender,f_name:f_name,l_name:l_name,address:address,
                    city_id:city_id,area_id:area_id,email:email,password:password,category_id:category_id,subject_id:subject_id,
                    level_id:level_id,hour_per_week:hour_per_week,description:description,user_type:user_type},function (data) {
                    //console.log(data);
                    myApp.hidePreloader();
                    if(data == 'Email already taken.'){
                        myApp.alert(data,'Alert!');
                    }else{

                        myApp.alert(data,'Alert!');
                        mainView.router.loadPage('login.html');
                    }

                });
            }



        });

    }
    if (page.name === 'tutor-signup') {

        // $.get('http://dotslog.com/talent/public/api/getAllCities',function (data) {
        //     // console.log(data);
        //     $.each(data.data,function (key,value) {
        //         $('.city').append('<option value="'+value.id+'">'+value.city_name+'</option>');
        //     });
        //
        // });


        $.get('http://dotslog.com/talent/public/api/getAllArea',function (data) {
            // console.log(data);
            $.each(data.data,function (key,value) {
                $('.area').append('<option value="'+value.id+'">'+value.area_name+'</option>');
            });
        });

        $('#signup_btn').on('click',function () {
            event.preventDefault();
            var f_name = $('#f_name').val();
            var l_name = $('#l_name').val();
            var address = $('#address').val();
            var city_id = $('#city_id').val();
            var area_id = $('#area_id').val();
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
                $.post('http://dotslog.com/talent/public/api/postSignup',{gender:gender,f_name:f_name,l_name:l_name,address:address,
                    city_id:city_id,area_id:area_id,email:email,password:password,category_id:category_id,subject_id:subject_id,
                    level_id:level_id,hour_per_week:hour_per_week,description:description,user_type:user_type,title:title,
                    dob:dob,mobile:mobile,phone:phone},function (data) {
                    //console.log(data);
                    myApp.hidePreloader();
                    if(data == 'Email already taken.'){
                        myApp.alert(data,'Alert!');
                    }else{

                        myApp.alert(data,'Alert!');
                        mainView.router.loadPage('login.html');

                    }

                });
            }


        });

    }
    if (page.name === 'institute-signup') {
        // $.get('http://dotslog.com/talent/public/api/getAllCities',function (data) {
        //     // console.log(data);
        //     $.each(data.data,function (key,value) {
        //         $('.city').append('<option value="'+value.id+'">'+value.city_name+'</option>');
        //     });
        //
        // });


        $.get('http://dotslog.com/talent/public/api/getAllArea',function (data) {
            // console.log(data);
            $.each(data.data,function (key,value) {
                $('.area').append('<option value="'+value.id+'">'+value.area_name+'</option>');
            });
        });

        $('#signup_btn').on('click',function () {
            event.preventDefault();
            var address = $('#address').val();
            var city_id = $('#city_id').val();
            var area_id = $('#area_id').val();
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
                $.post('http://dotslog.com/talent/public/api/postSignup',{address:address,
                    city_id:city_id,area_id:area_id,email:email,password:password,category_id:category_id,subject_id:subject_id,
                    level_id:level_id,hour_per_week:hour_per_week,description:description,user_type:user_type,
                    dob:dob,mobile:mobile,phone:phone,institute:institute,c_person:c_person,landline:landline},function (data) {
                    //console.log(data);
                    myApp.hidePreloader();
                    if(data == 'Email already taken.'){
                        myApp.alert(data,'Alert!');
                    }else{

                        myApp.alert(data,'Alert!');
                        mainView.router.loadPage('login.html');
                    }

                });
            }


        });

    }
    if (page.name === 'signin') {

        $('#login_btn').on('click',function () {
            var email = $('#email').val();
            var password = $('#password').val();
            myApp.showPreloader();
            $.post('http://dotslog.com/talent/public/api/postLogin',{email:email,password:password},function (data) {
                myApp.hidePreloader();
                if(data.error){
                    myApp.alert(data.error,'Alert!');
                }else{
                    mainView.router.loadPage('index.html');
                    window.localStorage.setItem('token',data.token);
                    myApp.alert("You have successfully signed in!!",'Alert!');
                    window.localStorage.setItem('user_type',data.user['user_type']);
                    window.localStorage.setItem('auth_id',data.user['id']);

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
        $.get('http://dotslog.com/talent/public/api/getAllStudent',function (data) {
            myApp.hidePreloader();
            // console.log(data);
            $.each(data,function (key,value) {

                $('#main').append('<div class="thumbnail">' +
                    '<div class="data-table data-table-init card"><div class="card-content">' +
                    '<img src="img/avatar/student.png" class="responsive" /><table>' +
                    '<tbody><tr><th style="border-top: 1px solid #e0e0e0;">Name</th>' +
                    '<td>'+value.f_name+' '+value.l_name+'</td></tr><tr><th>City</th><td>'+value.city_name+'</td></tr>' +
                    '<tr><th>Area</th><td>'+value.area_name+'</td></tr>' +
                    '<tr><th>Category</th><td>'+value.category_name+'</td>' +
                    '</tr><tr><th style="border-bottom: none!important;">Subjects</th>' +
                    '<td>'+value.subject_name+'</td></tr></tbody></table>' +
                    '<br/><div class="buttons"><a href="#" data-id="'+value.id+'" onclick="mailSignin(this);getID(this)"  class="button button-fill button-raised">View Ad</a>' +
                    '<a href="student-profile.html" data-id="'+value.id+'" onclick="mailSignin(this);getID(this)" class="button button-fill button-raised">View Profile</a>' +
                    '<a href="message.html" data-id="'+value.id+'" onclick="mailSignin(this);getID(this)" class="button button-fill button-raised">Send Message</a></div>' +
                    '</div></div></div>');
            })
        });

    }

    if (page.name === 'search-institute') {
        myApp.showPreloader();
        $.get('http://dotslog.com/talent/public/api/getAllInstitute',function (data) {
            myApp.hidePreloader();
            //console.log(data);
            $.each(data,function (key,value) {

                $('#main').append('<div class="thumbnail"><div class="data-table data-table-init card">' +
                    '<div class="card-content"><img src="img/avatar/institute.png" class="responsive" />' +
                    '<h3>'+value.institute+'</h3>' +
                    '<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit.' +
                    '</p><table><tbody><tr><th>City</th><td>'+value.city_name+'</td>' +
                    '</tr><tr><th>Area</th>' +
                    '<td>'+value.area_name+'</td></tr><tr><th style="border-bottom: none!important;">Subjects</th>' +
                    '<td>Arabic</td></tr></tbody></table>' +
                    '<br/><div class="buttons"><a href="institute-profile.html" data-id="'+value.id+'" onclick="mailSignin(this);getID(this)" class="button button-fill button-raised">View Profile</a>' +
                    '<a href="message.html" data-id="'+value.id+'" onclick="mailSignin(this);getID(this)" class="button button-fill button-raised">Send Message</a>' +
                    '<a href="" class="button button-fill button-raised">Read Reviews</a></div></div></div>');


            });
        });


    }

    if (page.name === 'search-tutor') {
        myApp.showPreloader();
        $.get('http://dotslog.com/talent/public/api/getAllTutor',function (data) {
            myApp.hidePreloader();
            // console.log(data);
            $.each(data,function (key,value) {

                $('#main').append(' <div class="thumbnail"><div class="data-table data-table-init card">' +
                    ' <div class="card-content">' +
                    '<img src="img/avatar/tutor.png" class="responsive" />' +
                    '<h3>'+value.f_name+' '+value.l_name+'</h3><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.' +
                    '</p><table><tbody> <tr><th>City</th><td>'+value.city_name+'</td>' +
                    '</tr><tr><th>Area</th><td>'+value.area_name+'</td> </tr>' +
                    '<tr><th style="border-bottom: none!important;">Subjects</th>' +
                    '<td>Arabic</td></tr> </tbody></table><br/><div class="buttons">' +
                    '<a href="tutor-profile.html"  data-id="'+value.id+'" onclick="mailSignin(this);getID(this)" class="button button-fill button-raised">View Profile</a>' +
                    '<a href="message.html"  data-id="'+value.id+'" onclick="mailSignin(this);getID(this)" class="button button-fill button-raised">Send Message</a>' +
                    '<a href="" class="button button-fill button-raised">Read Reviews</a>' +
                    '</div></div></div>');
            });
        });

    }

    if (page.name === 'inbox') {
        myApp.showPreloader();
        $.get('http://dotslog.com/talent/public/api/getAllConversation?token='+token,function (data) {
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
            $.post('http://dotslog.com/talent/public/api/getAllMessages?token='+token,{id:id},function (data) {

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
            $.post('http://dotslog.com/talent/public/api/getAllMessages?token='+token,{c_id:c_id},function (data) {

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

            $.post('http://dotslog.com/talent/public/api/postMessages?token='+token,{id:id,receiver_id:receiver_id,message:messageText},function (data) {
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
            $.post('http://dotslog.com/talent/public/api/store?token='+token,{plan_type:'basic',period:period},function (data) {
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
            $.post('http://dotslog.com/talent/public/api/store?token='+token,{plan_type:'premium',period:period,plan_price:price},function (data) {
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
        $.post('http://dotslog.com/talent/public/api/student_profile?token='+token,{id:id},function (data) {
            // console.log(data);
            myApp.hidePreloader();
            $('#name').text(data[0].f_name+' ' +data[0].l_name);
            $('#address').text(data[0].address);
            $('#city').text(data[0].city_name);
            $('#area').text(data[0].area_name);
            $('#subject').text(data[0].subject_name);
            $('#category').text(data[0].category_name);
            $('#message_btn').data('id',data[0].id);
            window.localStorage.removeItem('id');

        });
    }

    if (page.name === 'tutor-profile') {

        var id = window.localStorage.getItem('id');
        myApp.showPreloader();
        $.post('http://dotslog.com/talent/public/api/tutor_profile?token='+token,{id:id},function (data) {
            myApp.hidePreloader();
            //console.log(data);
            $('#name').text(data[0].f_name+' ' +data[0].l_name);
            $('#city').text(data[0].city_name);
            $('#area').text(data[0].area_name);
            window.localStorage.removeItem('id');

        });
    }

    if (page.name === 'institute-profile') {

        var id = window.localStorage.getItem('id');
        myApp.showPreloader();
        $.post('http://dotslog.com/talent/public/api/institute_profile?token='+token,{id:id},function (data) {
            myApp.hidePreloader();
            // console.log(data);
            $('#name').text(data[0].institute);
            $('#c_person').text(data[0].c_person);
            $('#address').text(data[0].address);
            $('#city').text(data[0].city_name);
            $('#area').text(data[0].area_name);
            $('#email').text(data[0].email);
            $('#phone').text(data[0].phone);
            $('#landline').text(data[0].landline);
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
    $.post('http://dotslog.com/talent/public/api/permissions?token='+token,{id:id},function (data) {

        if(data == 'allowed'){

        }else{

            if(myApp.confirm('You Have to be a member to use this functionality!!')){
                mainView.router.loadPage('membership.html');
            }

        }
    });

}

function mailSignin(element){
    var token = window.localStorage.getItem('token');
    if(!token){
        myApp.alert("You must signin to access this",'Alert!');
        $(element).prop('href','#');
    }
}

// function cityGetter() {
//     $.get('http://dotslog.com/talent/public/api/getAllCities',function (data) {
//         // console.log(data);
//         $.each(data.data,function (key,value) {
//             $('.city').append('<option value="'+value.id+'">'+value.city_name+'</option>');
//         });
//
//     });
// }


