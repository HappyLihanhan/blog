import io
import unittest
import zipfile

import server


def formatted_question_workbook():
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr(
            "xl/worksheets/sheet1.xml",
            """<x:worksheet xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><x:sheetData>
            <x:row r="4"><x:c r="A4" t="str"><x:v>序号</x:v></x:c><x:c r="B4" t="str"><x:v>题目</x:v></x:c></x:row>
            <x:row r="5"><x:c r="A5"><x:v>1</x:v></x:c><x:c r="B5" t="str"><x:v>C++ 虚函数如何实现？</x:v></x:c></x:row>
            <x:row r="6"><x:c r="A6"><x:v>2</x:v></x:c><x:c r="B6" t="str"><x:v>请做自我介绍，并说明为什么选择游戏客户端方向？</x:v></x:c></x:row>
            </x:sheetData></x:worksheet>""",
        )
        archive.writestr(
            "xl/worksheets/sheet2.xml",
            """<worksheet><sheetData><row r="1"><c r="A1" t="str"><v>评分说明</v></c></row></sheetData></worksheet>""",
        )
    return buffer.getvalue()


class QuestionBankImportTests(unittest.TestCase):
    def test_formatted_xlsx_without_answer_column_is_uploadable(self):
        questions = server.parse_question_bank_file(
            "米哈游面试题.xlsx",
            formatted_question_workbook(),
            "source-1",
            "custom-client",
        )

        self.assertEqual(len(questions), 2)
        self.assertEqual(questions[0]["question"], "C++ 虚函数如何实现？")
        self.assertEqual(questions[0]["answer"], "")
        self.assertEqual(questions[0]["category"], "custom-client")
        self.assertEqual(questions[1]["category"], "custom-client")

    def test_upload_target_supports_auto_existing_and_new_sub_banks(self):
        state = {"categories": [{"id": "custom-existing", "label": "已有专项"}]}

        self.assertEqual(server.resolve_question_bank_upload_target({}, state), {"mode": "auto"})
        self.assertEqual(
            server.resolve_question_bank_upload_target(
                {"targetMode": "existing", "categoryId": "graphics"},
                state,
            ),
            {"mode": "existing", "categoryId": "graphics"},
        )
        created = server.resolve_question_bank_upload_target(
            {"targetMode": "new", "categoryName": "米哈游客户端专项"},
            state,
        )
        self.assertEqual(created["mode"], "new")
        self.assertEqual(created["category"]["label"], "米哈游客户端专项")
        self.assertTrue(created["categoryId"].startswith("custom-"))


if __name__ == "__main__":
    unittest.main()
