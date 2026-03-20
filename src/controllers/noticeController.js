let notices = [];
const noticeTitle = "시스템 점검 공지";

export const allNotice = (req, res) => {
  return res.render("notice_all", { noticeTitle, notices });
};

export const newNotice = (req, res) => {
  return res.render("notice_new", { noticeTitle });
};

export const postNotice = (req, res) => {
  const { title } = req.body;
  notices.push(title);
  console.log(notices);
  return res.redirect("/notices/all");
};
