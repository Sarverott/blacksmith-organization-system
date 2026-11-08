"""Exercise the actual uv guard against an isolated project, including both drift directions."""
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).with_name("docs-lock.sh").resolve()


class DocsLockTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.project = Path(self.temp.name)
        self.env = {**os.environ, "UV_OFFLINE": "1"}
        self.manifest = self.project / "pyproject.toml"
        self.manifest.write_text(
            '[project]\nname = "lock-fixture"\nversion = "0.1.0"\n'
            'requires-python = ">=3.12"\ndependencies = []\n'
            '[tool.uv]\npackage = false\n'
        )
        self.run_uv("lock", "--python", sys.executable)
        self.export()

    def run_uv(self, *args):
        return subprocess.run(
            ["uv", *args, "--project", str(self.project)],
            env=self.env, capture_output=True, text=True, check=True,
        )

    def export(self):
        result = self.run_uv(
            "export", "--locked", "--no-hashes", "--no-header",
            "--no-annotate", "--no-emit-project",
        )
        (self.project / "requirements.txt").write_text(result.stdout)

    def guard(self):
        before = {p.name: p.read_bytes() for p in self.project.iterdir() if p.is_file()}
        result = subprocess.run(
            ["bash", str(SCRIPT), str(self.project)],
            env=self.env, capture_output=True, text=True,
        )
        after = {p.name: p.read_bytes() for p in self.project.iterdir() if p.is_file()}
        self.assertEqual(before, after, "a check must never repair its input")
        return result

    def test_consistent_export_passes(self):
        result = self.guard()
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_stale_export_fails_then_regenerated_export_passes(self):
        (self.project / "requirements.txt").write_text("stale==1.0\n")
        result = self.guard()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("export differs", result.stderr)
        self.export()
        self.assertEqual(self.guard().returncode, 0)

    def test_stale_lock_fails(self):
        self.manifest.write_text(self.manifest.read_text().replace(
            'dependencies = []', 'dependencies = ["missing-offline-fixture==1"]',
        ))
        self.assertNotEqual(self.guard().returncode, 0)


if __name__ == "__main__":
    unittest.main()
