//引入
const { app } = require("electron");
const path = require('path')
const { open } = require("sqlite");
const sqlite3 = require("sqlite3").verbose();

// const log = require('electron-log');
// log.transports.file.file = path.join(app.getPath('userData'), 'app.log');

//dbPath为你想存放数据库文件的目录路径
const connectDb = (dbPath) => {
    return open({
        filename: dbPath,
        driver: sqlite3.Database,
    });
};
//自定义数据库路径---开发
// const userDbPath = path.resolve(__dirname, "mydb.db");

// -------生产
// 获取用户数据目录
const userDataPath = app.getPath('userData');
// // 创建数据库文件路径
const userDbPath = path.join(userDataPath, 'mydb.db');

const createUserInfoTable = async () => {
    const userInfoDb = await connectDb(userDbPath);
    // console.log('Application started.');
    // -- 1、考试信息表
    const sql_bus_exam = `create table if not exists bus_exam (
                id  INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL,
                uid int DEFAULT NULL ,
                create_time datetime DEFAULT NULL ,
                update_time datetime DEFAULT NULL ,
                exam_name varchar(128)  NOT NULL DEFAULT '' ,
                cover_url varchar(255)  DEFAULT '' ,
                exam_notes text  ,
                paper_id int DEFAULT NULL ,
                exam_number int DEFAULT NULL ,
                content longtext  ,
                pass_score decimal(6,2) DEFAULT '0.00' ,
                score decimal(6,0) DEFAULT '0' ,
                start_time bigint DEFAULT '0' ,
                end_time bigint DEFAULT '0' ,
                answer_time smallint DEFAULT '60' ,
                answer_times smallint DEFAULT '1' ,
                late_time tinyint DEFAULT NULL ,
                is_cheat tinyint(1) DEFAULT '0' ,
                cheat_parameters text  ,
                subject_random tinyint(1) DEFAULT NULL ,
                option_random tinyint(1) DEFAULT NULL ,
                extract_random tinyint(1) DEFAULT '0' ,
                extra_options text  ,
                status tinyint(1) DEFAULT '0' ,
                is_order tinyint(1) DEFAULT NULL ,
                is_score tinyint(1) DEFAULT NULL ,-- '是否显
                is_view tinyint(1) DEFAULT NULL ,
                is_used tinyint(1) DEFAULT '0' ,
                class_id int DEFAULT NULL ,
                choose_num mediumint DEFAULT '0' ,
                is_del tinyint(1) DEFAULT '0' ,
                password varchar(64)  DEFAULT '' ,
                pay_status tinyint DEFAULT '0' ); `

    // --  2、学生考试关系表
    const sql_sj_class_member = `create table if not exists sj_class_member (
                    id INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL,
                    class_id int(11) NULL DEFAULT NULL ,
                    classnumber varchar(50)  NULL DEFAULT NULL ,
                    t_uid int(11) NULL DEFAULT NULL ,
                    s_uid int(11) NULL DEFAULT NULL ,
                    s_name varchar(255)  NULL DEFAULT NULL,
                    s_pic varchar(255)  NULL DEFAULT NULL,
                    s_number varchar(255)  NULL DEFAULT NULL,
                    s_mobile varchar(255)  NULL DEFAULT NULL,
                    s_real_name varchar(255)  NULL DEFAULT NULL,
                    status int(11) NULL DEFAULT 0 ,
                    is_assistant tinyint(4) NULL DEFAULT 0,
                    add_time varchar(13)  NULL DEFAULT '' ,
                    ts timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                    college varchar(255)  NULL DEFAULT NULL,
                    major varchar(255)  NULL DEFAULT NULL,
                    advisor varchar(255)  NULL DEFAULT NULL,
                    data_type INTEGER DEFAULT 0 NOT NULL, 
                    syn_status INTEGER DEFAULT 0 NOT NULL,
                    login_status INTEGER DEFAULT 0 NOT NULL); `

    // 3、考试作答记录表
    const sql_bus_exam_result = `create table if not exists bus_exam_result (
                        id INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL,
                        unique_id varchar(128)  NOT NULL ,
                        uid int DEFAULT NULL ,
                        create_time datetime DEFAULT NULL ,
                        update_time datetime DEFAULT NULL ,
                        exam_id int NOT NULL DEFAULT '0' ,
                        class_id int DEFAULT NULL ,
                        content longtext  ,
                        start_time bigint NOT NULL DEFAULT '0' ,
                        end_time bigint NOT NULL DEFAULT '0' ,
                        do_time int DEFAULT NULL ,
                        system_score decimal(6,2) DEFAULT NULL ,
                        user_score decimal(6,2) DEFAULT NULL ,
                        exam_score decimal(6,0) DEFAULT NULL ,
                        question_correct int DEFAULT NULL ,
                        question_count int DEFAULT NULL ,
                        is_read tinyint(1) NOT NULL DEFAULT '0' ,
                        status tinyint(1) NOT NULL DEFAULT '0' ,
                        is_del tinyint(1) NOT NULL DEFAULT '0' ,
                        is_max tinyint(1) NOT NULL DEFAULT '0' ,
                        ranking int DEFAULT NULL ,
                        screenshot_times int DEFAULT '0' ,
                        screencap_times int DEFAULT '0' ,
                        data_type int DEFAULT '0' ,
                        syn_status INTEGER DEFAULT 0 NOT NULL,
                        force_submit_flag int DEFAULT '0' ,
                        face_photo varchar(255)  NULL DEFAULT NULL,
                        photo varchar(255)  NULL DEFAULT NULL,
                        exam_ip varchar(255)  NULL DEFAULT NULL,
                        remark varchar(255)  DEFAULT NULL );`
    // 4、系统设置
    const sql_interface_details = `create table if not exists interface_details (
                        id INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL,
                        interface_name varchar(255)  NOT NULL ,
                        ip_whitelist varchar(255)  NULL DEFAULT NULL,
                        ip_blacklist varchar(255)  NULL DEFAULT NULL,
                        local_ip varchar(255)  NULL DEFAULT NULL,
                        remark varchar(255)  DEFAULT NULL );`
    //5、本地试卷信息
    const sql_local_paper_info = `create table if not exists local_paper_info (
                        id INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL,
                        exam_id int NOT NULL DEFAULT '0' ,
                        content text,
                        create_time datetime DEFAULT NULL ,
                        update_time datetime DEFAULT NULL );`
    //6、本地相关文件存储
    const sql_local_file_info = `create table if not exists local_file_info (
                        id INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL,
                        exam_id int NOT NULL DEFAULT '0' ,
                        uid int DEFAULT NULL,
                        file_type int NOT NULL DEFAULT '0',
                        bank_id int DEFAULT '0',
                        local_path text,
                        full_path text,
                        oss_path text,
                        create_time datetime DEFAULT NULL ,
                        update_time datetime DEFAULT NULL );`

    let res = null;
    try {
        //查询使用userInfoDb.get userInfoDb.all等 更多命令请查阅官方文档
        const runRes1 = await userInfoDb.run(sql_bus_exam);
        const runRes2 = await userInfoDb.run(sql_sj_class_member);
        const runRes3 = await userInfoDb.run(sql_bus_exam_result);
        const runRes4 = await userInfoDb.run(sql_interface_details);
        const runRes5 = await userInfoDb.run(sql_local_file_info);
        const runRes6 = await userInfoDb.run(sql_local_paper_info);
        res = {
            code: 200,
            data: [runRes1, runRes2, runRes3, runRes4,runRes5,runRes6]
        }
    } catch (e) {
        console.log('error---------');
        console.log(e)
        res = {
            code: 500,
            msg: e
        }
    } finally {
        console.log('建表完成--------------');
        //最后关闭连接
        await userInfoDb.close();
    }
    // log.transports.file.end();
    return res;
}
// 重新创建表，用户清理缓存
const dropUserInfoTable = async () => {
    const userInfoDb = await connectDb(userDbPath);
    // console.log('Application started.');
    // -- 1、考试信息表
    const sql_bus_exam = `DROP TABLE IF EXISTS bus_exam;`

    // --  2、学生考试关系表
    const sql_sj_class_member = `DROP TABLE IF EXISTS sj_class_member; `

    // 3、考试作答记录表
    const sql_bus_exam_result = `DROP TABLE IF EXISTS bus_exam_result;`
    // 4、系统设置
    const sql_interface_details = `DROP TABLE IF EXISTS interface_details;`
    // 5、本地文件表
    const sql_local_file_info= `DROP TABLE IF EXISTS local_file_info;`
    // 6、本地试卷表
    const sql_local_paper_info = `DROP TABLE IF EXISTS local_paper_info;`

    let res = null;
    try {
        //查询使用userInfoDb.get userInfoDb.all等 更多命令请查阅官方文档
        const runRes1 = await userInfoDb.run(sql_bus_exam);
        const runRes2 = await userInfoDb.run(sql_sj_class_member);
        const runRes3 = await userInfoDb.run(sql_bus_exam_result);
        const runRes4 = await userInfoDb.run(sql_interface_details);
        const runRes5 = await userInfoDb.run(sql_local_file_info);
        const runRes6 = await userInfoDb.run(sql_local_paper_info);
        res = {
            code: 200,
            data: [runRes1, runRes2, runRes3, runRes4, runRes5,runRes6]
        }
    } catch (e) {
        console.log('error---------');
        console.log(e)
        res = {
            code: 500,
            msg: e
        }
    } finally {
        console.log('删除表完成--------------');
        //最后关闭连接
        await userInfoDb.close();
    }
    // log.transports.file.end();
    return res;
}
// createUserInfoTable()
module.exports = { createUserInfoTable, dropUserInfoTable };