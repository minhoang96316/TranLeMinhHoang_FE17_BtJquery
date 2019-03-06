var userList = [];
var courseList = [];
var user;
function hienThiModal() {
    //doi title cua modal
    $('.modal-title').html('Thêm người dùng')
    var btnGroups = `<button class="btn btn-success" id="btnThem">Thêm Người Dùng</button>
                     <button class="btn btn-secondary" data-dismiss="modal">Đóng</button>`
    $('.modal-footer').html(btnGroups);
}

function capNhatModal() {
    $('.modal-title').html('Cập Nhật')
    var btnGroups = `<button class="btn btn-success" id="btnCapNhatThongTin">Cập nhật</button>
                     <button class="btn btn-secondary" data-dismiss="modal">Đóng</button>`
    $('.modal-footer').html(btnGroups);
}

var userListFromDB = function () {
    $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/DanhSachNguoiDung',
        type: 'GET',
    }).done(function (res) {
        userList = res;
        console.log(userList)
        renderUserList(userList);
    }).fail(function (err) {

    })
}
userListFromDB();
function renderUserList(list) {
    var tbody = $('#tblDanhSachNguoiDung');
    var content = "";
    for (var i = 0; i < list.length; i++) {
        content += `
          <tr>
               <td>${i + 1}</td>
               <td>${list[i].TaiKhoan}</td>
               <td>${list[i].MatKhau}</td>
               <td>${list[i].HoTen}</td>
               <td>${list[i].Email}</td>
               <td>${list[i].SoDT}</<td>
               <td>
               <button
                    data-taiKhoan ="${list[i].TaiKhoan}"
                    data-matkhau ="${list[i].MatKhau}"
                    data-hoten ="${list[i].HoTen}"
                    data-email ="${list[i].Email}"
                    data-sodt ="${list[i].SoDT}"
                    data-maloainguoidung ="${list[i].MaLoaiNguoiDung}"
                    data-toggle = "modal"
                    data-target = "#myModal" 
                    class="btn btn-info btnCapNhat"> 
                    Cập Nhật
                 </button>
                <button class="btn btn-danger btnXoa" data-taikhoan="${list[i].TaiKhoan}"> Xóa </button>
               </td>       
          </tr>
        `
    }
    tbody.html(content);
}

function dangKyNguoiDung() {
    var taiKhoan = $('#txtTaiKhoanDK').val();
    var matKhau = $('#txtMatKhauDK').val();
    var hoTen = $('#txtHoTen').val();
    var email = $('#txtEmail').val();
    var soDT = $('#txtSoDT').val();
    var maLoaiNguoiDung = "HV";
    var NguoiDungMoi = new NguoiDung(taiKhoan, matKhau, hoTen, email, soDT, maLoaiNguoiDung);
    $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/DangKy',
        type: 'POST',
        data: NguoiDungMoi
    }).done(function (res) {
        userList.push(NguoiDungMoi);
        userListFromDB();
    }).fail(function (err) {
        console.log(err);
    })
}
function dangNhap() {
    var taiKhoan = $('#txtTaiKhoan').val();
    var matKhau = $('#txtMatKhau').val();
    var content = "";
    content += `taikhoan=${taiKhoan}&matkhau=${matKhau}`
    $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/DangNhap?' + content,
        type: 'GET',
    }).done(function (res) {
        user = res;
        var jsonUser = JSON.stringify(user);
        localStorage.setItem("TaiKhoan", jsonUser);
        if (user[0].MaLoaiNguoiDung === "HV") {
            window.location.assign('KhoaHoc.html');
        }
        else if (user[0].MaLoaiNguoiDung === "GV") {
            window.location.assign('index.html');
        }
    }).fail(function (err) {
        console.log(err);
    })
}
danhSachKhoaHoc();
function danhSachKhoaHoc() {
    var taiKhoan = localStorage.getItem("TaiKhoan");
    user = JSON.parse(taiKhoan);
    var name = user[0].TaiKhoan;
    var content = "";
    content += `taikhoan=${name}`;
    $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/LayThongtinKhoaHoc?' + content,
        type: 'GET',
    })
        .done(function (res) {
            courseList = res;
            if(courseList[0].MaKhoaHoc !== undefined){
                renderCourseItems(courseList)
            }
            else{
            }
        }).fail(function (err) {
            console.log(err);
        })
}




function renderCourseItems(list) {
    var content = "";
    for (var i = 0; i < list.length; i++) {
        content += `
        <div class="col-3">
        <div class="card">
            <img src="${list[i].HinhAnh}" style="height:300px"/>
            <p>Tên Khóa Học: ${list[i].TenKhoaHoc}</p>
            <p>Tên Người Tạo: ${list[i].HoTen}</p>
            <a href="chitiet.html?makhoahoc=${list[i].MaKhoaHoc}" class="btn btn-success btnXemChiTiet">Xem chi tiết</a>
        </div>
    </div>`
    }
    $('#danhSachKhoaHoc').html(content);
}
// $('body').delegate('.btnXemChiTiet','click',function(){
//     window.location.assign('chitiet.html?makhoahoc=' + maKhoaHoc);
// })



function AddUser() {
    var taiKhoan = $('#TaiKhoan').val();
    var matKhau = $('#MatKhau').val();
    var hoTen = $('#HoTen').val();
    var email = $('#Email').val();
    var soDT = $('#SoDienThoai').val();
    var maLoaiNguoiDung = $('#maLoaiNguoiDung').val();
    //tao doi tuong
    var NguoiDungMoi = new NguoiDung(taiKhoan, matKhau, hoTen, email, soDT, maLoaiNguoiDung);
    //ket noi server, them nguoi dung moi 
    $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/ThemNguoiDung',
        type: 'POST',
        data: NguoiDungMoi
    }).done(function (res) {
        userList.push(NguoiDungMoi);
        renderUserList(userList);
    }).fail(function (err) {
        console.log(err);
    })
    //an modal
    $('.close').trigger('click');
    renderUserList(userList);

    //clear input 
    $('.modal-body input').val('');
}

function findUser() {
    var findList = [];
    var keyword = $('#timKiem').val();
    for (var i = 0; i < userList.length; i++) {
        if (userList[i].HoTen === keyword || userList[i].TaiKhoan === keyword) {
            findList.push(userList[i]);
        }
    }
    renderUserList(findList);
}

function TimViTriTheoTaiKhoan(danhSach, taiKhoan) {
    for (var i = 0; i < danhSach.length; i++) {
        if (danhSach[i].TaiKhoan === taiKhoan) {
            return i;
        }
    }
    return -1;
}

function xoaNguoiDung() {
    //Lay data-taikhoan ma btn dang luu
    var taiKhoan = $(this).attr('data-taikhoan');
    $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/XoaNguoiDung/' + taiKhoan,
        type: 'DELETE'
    }).done(function (res) {
        var index = TimViTriTheoTaiKhoan(userList, taiKhoan);
        if (index !== -1) {
            userList.splice(index, 1);
            renderUserList(userList);
        }
    }).fail(function (err) {
        console.log(err);
    })
}

function layThongTinND() {
    //Lay ra thong tin ma btn dang luu
    var taiKhoan = $(this).attr('data-taikhoan');
    var matKhau = $(this).attr('data-matkhau');
    var hoTen = $(this).attr('data-hoten');
    var Email = $(this).attr('data-email');
    var soDT = $(this).attr('data-sodt');
    var maLoaiNguoiDung = $(this).attr('data-maloainguoidung');
    //set gia tri cho input
    $('#TaiKhoan').attr('readonly',true);
    $('#TaiKhoan').val(taiKhoan);
    $('#MatKhau').val(matKhau);
    $('#HoTen').val(hoTen);
    $('#Email').val(Email);
    $('#SoDienThoai').val(soDT);
    $('#maLoaiNguoiDung').val(maLoaiNguoiDung);
}
//Cap nhat thong tin
function capNhat() {
    //Lay thong tin tu form
    var taiKhoan = $('#TaiKhoan').val();
    var matKhau = $('#MatKhau').val();
    var hoTen = $('#HoTen').val();
    var email = $('#Email').val();
    var soDT = $('#SoDienThoai').val();
    var maLoaiNguoiDung = $('#maLoaiNguoiDung').val();
    //tao doi tuong moi 
    var nguoiDung = new NguoiDung(taiKhoan, matKhau, hoTen, email, soDT, maLoaiNguoiDung);
    $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/CapNhatThongTinNguoiDung',
        type: 'PUT',
        data: nguoiDung,
    }).done(function (res) {
        console.log(res)      
        // Tim vi tri nguoi dung trong danh sach 
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].TaiKhoan === taiKhoan) {
                userList[i] = nguoiDung;
                break;
            }
        }
        //Cap nhat tung thuoc tinh cho nguoi dung
        nguoiDung.TaiKhoan = taiKhoan;
        nguoiDung.MatKhau = matKhau;
        nguoiDung.HoTen = hoTen;
        nguoiDung.Email = email;
        nguoiDung.SoDT = soDT;
        nguoiDung.MaLoaiNguoiDung = maLoaiNguoiDung;
        //Hien thi lai giao dien
        renderUserList(userList);

        //Go readonly
        $('#TaiKhoan').attr('readonly',false);
        //an modal
        $('.close').trigger('click');

    }).fail(function (err) {
        console.log(err)
    })
}
$('#btnThemNguoiDung').click(hienThiModal);
$('#timKiem').keyup(findUser);
$('body').delegate('#btnThem', 'click', AddUser);
$('body').delegate('.btnXoa', 'click', xoaNguoiDung);
$('body').delegate('.btnCapNhat', 'click', capNhatModal);
$('body').delegate('.btnCapNhat', 'click', layThongTinND);
$('body').delegate('#btnCapNhatThongTin', 'click', capNhat);