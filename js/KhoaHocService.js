var coursesList = [];
var user;


function hienThiModal() {
    //doi title cua modal
    $('.modal-title').html('Thêm Khóa Học')
    var btnGroups = `<button class="btn btn-success" id="btnThemKH">Thêm Khóa Học</button>
                     <button class="btn btn-secondary" data-dismiss="modal">Đóng</button>`
    $('.modal-footer').html(btnGroups);
}

function capNhatModal() {
    $('.modal-title').html('Cập Nhật')
    var btnGroups = `<button class="btn btn-success" id="btnCapNhatThongTinKH">Cập nhật</button>
                     <button class="btn btn-secondary" data-dismiss="modal">Đóng</button>`
    $('.modal-footer').html(btnGroups);
}

function ghiDanhModal() {
    $('.modal-title').html('Ghi Danh')
    var btnGroups = `<button class="btn btn-success" id="btnGhiDanhKH">Ghi Danh</button>
                     <button class="btn btn-secondary" data-dismiss="modal">Đóng</button>`
    $('.modal-footer').html(btnGroups);
}

var getCourseListFromDB = function () {
    $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/DanhSachKhoaHoc',
        type: 'GET',
    }).done(function (res) {
        coursesList = res;
        renderCourseTbl(coursesList)
    }).fail(function (err) {

    })
}
function renderCourseTbl(list) {
    var tbody = $('#tblDanhSachKhoaHoc');
    var content = "";
    for (var i = 0; i < list.length; i++) {
        content += `
          <tr>
               <td>${i + 1}</td>
               <td>${list[i].MaKhoaHoc}</td>
               <td>${list[i].TenKhoaHoc}</td>
               <td>${list[i].MoTa}</td>
               <td><img src="${list[i].HinhAnh}" style="height:100px"/></td>
               <td>${list[i].LuotXem}</td>
               <td>${list[i].NguoiTao}</<td>
               <td>
               <button
               data-makhoahoc ="${list[i].MaKhoaHoc}"
               data-tenkhoahoc ="${list[i].TenKhoaHoc}"
               data-mota ="${list[i].MoTa}"
               data-hinhanh ="${list[i].HinhAnh}"
               data-luotxem ="${list[i].LuotXem}"
               data-toggle = "modal"
               data-target = "#myModal2" 
               class="btn btn-info btnCapNhatKH"> 
               Cập Nhật
            </button>
               <button class="btn btn-danger btnXoaKH" data-ma="${list[i].MaKhoaHoc}"> Xóa </button>
               </td>         
          </tr>
        `
    }
    tbody.html(content);
}

getCourseListFromDB();

function ghiDanhKhoaHoc() {
    var taiKhoan = $('#TenTaiKhoan').val();
    var maKhoaHoc = $('#MaKhoaHocGD').val();
    var model = JSON.stringify({ MaKhoaHoc: maKhoaHoc, TaiKhoan: taiKhoan })
    $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/GhiDanhKhoaHoc',
        type: 'POST',
        contentType: "application/json",
        dataType: "json",
        data: model
    }).done(function (res) {
        console.log(res);
        $('.close').trigger('click');
    }).fail(function (err) {
        console.log(err);
    })
}

function AddCourse() {
    var taiKhoan = localStorage.getItem("TaiKhoan");
    var user = JSON.parse(taiKhoan);
    var nguoiTao = user[0].TaiKhoan;
    var maKhoaHoc = $('#MaKhoaHoc').val();
    var tenKhoaHoc = $('#TenKhoaHoc').val();
    var moTa = $('#MoTa').val();
    var hinhAnh = $('#HinhAnh').val();
    var luotXem = $('#LuotXem').val();
    //tao doi tuong

    var khoaHocMoi = new KhoaHoc(maKhoaHoc, tenKhoaHoc, moTa, hinhAnh, luotXem, nguoiTao);
    //ket noi server, them khoa hoc moi 
    $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/ThemKhoaHoc',
        type: 'POST',
        dataType: 'json',
        data: khoaHocMoi
    }).done(function (res) {
        coursesList.push(khoaHocMoi);
        renderCourseTbl(coursesList);
    }).fail(function (err) {
        console.log(err);
    })
    //an modal
    $('.close').trigger('click');
    renderCourseTbl(coursesList);

    //clear input 
    $('.modal-body input').val('');
}

function TimViTriTheoMaKhoaHoc(danhSach, maKH) {
    for (var i = 0; i < danhSach.length; i++) {
        if (danhSach[i].MaKhoaHoc === maKH) {
            return i;
        }
    }
    return -1;
}

function xoaKhoaHoc() {
    //Lay data-taikhoan ma btn dang luu
    var maKhoaHoc = $(this).attr('data-ma');
    console.log(maKhoaHoc)
    $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/XoaKhoaHoc/' + maKhoaHoc,
        type: 'DELETE'
    }).done(function (res) {
        var index = TimViTriTheoMaKhoaHoc(coursesList, maKhoaHoc);
        if (index !== -1) {
            coursesList.splice(index, 1);
            renderCourseTbl(coursesList);
        }
    }).fail(function (err) {
        console.log(err);
    })
}

function findCourses() {
    var findList = [];
    var keyword = $('#timKiemKH').val();
    for (var i = 0; i < coursesList.length; i++) {
        if (coursesList[i].MaKhoaHoc === keyword || coursesList[i].TenKhoaHoc === keyword) {
            findList.push(coursesList[i]);
        }
    }
    renderCourseTbl(findList);
}


function layThongTinKH() {
    //Lay ra thong tin ma btn dang luu
    var maKhoaHoc = $(this).attr('data-makhoahoc');
    var tenKhoaHoc = $(this).attr('data-tenkhoahoc');
    var moTa = $(this).attr('data-mota');
    var hinhAnh = $(this).attr('data-hinhanh');
    var luotXem = $(this).attr('data-luotxem');
    //set gia tri cho input
    $('#MaKhoaHoc').attr('readonly', true);
    $('#MaKhoaHoc').val(maKhoaHoc);
    $('#TenKhoaHoc').val(tenKhoaHoc);
    $('#MoTa').val(moTa);
    $('#HinhAnh').val(hinhAnh);
    $('#LuotXem').val(luotXem);
}
//Cap nhat thong tin
function capNhatKH() {
    //Lay thong tin tu form
    var maKhoaHoc = $('#MaKhoaHoc').val();
    var tenKhoaHoc = $('#TenKhoaHoc').val();
    var moTa = $('#MoTa').val();
    var hinhAnh = $('#HinhAnh').val();
    var luotXem = $('#LuotXem').val();
    var taiKhoan = localStorage.getItem("TaiKhoan");
    var user = JSON.parse(taiKhoan);
    var nguoiTao = user[0].TaiKhoan;
    //tao doi tuong moi 
    var khoaHocMoi = JSON.stringify({ MaKhoaHoc: maKhoaHoc, TenKhoaHoc: tenKhoaHoc, MoTa: moTa, HinhAnh: hinhAnh, LuotXem: luotXem, NguoiTao: nguoiTao });
    // var jsonkhoaHocMoi = JSON.stringify(khoaHocMoi);

    console.log(khoaHocMoi)
    $.ajax({
        url: 'http://sv.myclass.vn/api/QuanLyTrungTam/CapNhatKhoaHoc',
        type: 'PUT',
        contentType: "application/json",
        dataType: "json",
        data: khoaHocMoi
    }).done(function (res) {
        var khoaHoc = JSON.parse(khoaHocMoi)
        //Tim vi tri nguoi dung trong danh sach 
        for (var i = 0; i < coursesList.length; i++) {
            if (coursesList[i].MaKhoaHoc === maKhoaHoc) {
                coursesList[i] = khoaHoc;
                break;
            }
        }
        //Cap nhat tung thuoc tinh cho nguoi dung

        khoaHoc.MaKhoaHoc = maKhoaHoc;
        khoaHoc.TenKhoaHoc = tenKhoaHoc;
        khoaHoc.MoTa = moTa;
        khoaHoc.HinhAnh = hinhAnh;
        khoaHoc.LuotXem = luotXem;
        khoaHoc.nguoiTao = nguoiTao;
        //Hien thi lai giao dien
        renderCourseTbl(coursesList);
        //Go readonly
        $('#MaKhoaHoc').attr('readonly', false);
        //an modal
        $('.close').trigger('click');

    }).fail(function (err) {
        console.log(err)
    })
}

$('#btnThemKhoaHoc').click(hienThiModal);
$('#timKiemKH').keyup(findCourses);
$('#btnGhiDanh').click(ghiDanhModal);
$('body').delegate('#btnThemKH', 'click', AddCourse);
$('body').delegate('.btnXoaKH', 'click', xoaKhoaHoc);
$('body').delegate('.btnCapNhatKH', 'click', capNhatModal);
$('body').delegate('.btnCapNhatKH', 'click', layThongTinKH);
$('body').delegate('#btnCapNhatThongTinKH', 'click', capNhatKH);
$('body').delegate('#btnGhiDanhKH', 'click', ghiDanhKhoaHoc);