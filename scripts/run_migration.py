#!/usr/bin/env python3
"""
Script to execute SQL migrations on Supabase database
Usage: python run_migration.py <path_to_sql_file>
"""

import sys
import os
import urllib.parse

# Get database password from Supabase dashboard: Settings > Database > Connection String
# Format: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

def execute_sql_file(sql_file_path, db_url):
    """Execute SQL file using psycopg2"""
    try:
        import psycopg2
    except ImportError:
        print("Error: psycopg2 not installed. Install with: pip install psycopg2-binary")
        return False

    if not os.path.exists(sql_file_path):
        print(f"Error: SQL file not found: {sql_file_path}")
        return False

    try:
        # Read SQL file
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        # Connect to database
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cursor = conn.cursor()

        # Execute SQL
        print(f"Executing {sql_file_path}...")
        cursor.execute(sql_content)

        print(f"✓ Migration completed successfully!")

        cursor.close()
        conn.close()
        return True

    except Exception as e:
        print(f"Error executing migration: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_migration.py <path_to_sql_file> [db_url]")
        print("\nIf db_url is not provided, set DB_URL environment variable")
        sys.exit(1)

    sql_file = sys.argv[1]
    db_url = sys.argv[2] if len(sys.argv) > 2 else os.environ.get('DB_URL')

    if not db_url:
        print("Error: Database URL not provided")
        print("Set DB_URL environment variable or pass as second argument")
        sys.exit(1)

    success = execute_sql_file(sql_file, db_url)
    sys.exit(0 if success else 1)
